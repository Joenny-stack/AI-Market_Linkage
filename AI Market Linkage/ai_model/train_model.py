"""
train_model.py
--------------
Phase 2 – AI Tomato Quality Classification
Trains a MobileNetV2-based CNN to classify tomato images into four quality states:
    Damaged | Old | Ripe | Unripe

Usage:
    python ai_model/train_model.py
"""

import os
import json
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# ─── Reproducibility ──────────────────────────────────────────────────────────
SEED = 42
tf.random.set_seed(SEED)
np.random.seed(SEED)
print("Num GPUs Available:", len(tf.config.list_physical_devices("GPU")))

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
DATASET_DIR = os.path.join(PROJECT_DIR, "dataset")
TRAIN_DIR   = os.path.join(DATASET_DIR, "train")
VAL_DIR     = os.path.join(DATASET_DIR, "val")
MODEL_DIR   = os.path.join(BASE_DIR, "model")
MODEL_PATH  = os.path.join(MODEL_DIR, "tomato_classifier.h5")

os.makedirs(MODEL_DIR, exist_ok=True)

# ─── Hyperparameters ──────────────────────────────────────────────────────────
IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
EPOCHS_TOP  = 15        # Phase 1: train only the top classification head
EPOCHS_FINE = 10        # Phase 2: fine-tune last N base layers
NUM_CLASSES = 4

# Class order must match dataset folder names exactly (alphabetical by default,
# but we pin them explicitly for reproducibility)
CLASS_NAMES = ["Damaged", "Old", "Ripe", "Unripe"]

# AI class → market grade mapping (used in final print summary)
GRADE_MAP = {
    "Ripe"    : "Grade A",
    "Unripe"  : "Grade B",
    "Old"     : "Grade C",
    "Damaged" : "Reject",
}

# ─── Data Generators ──────────────────────────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale          = 1.0 / 255,
    rotation_range   = 20,
    zoom_range       = 0.2,
    horizontal_flip  = True,
    width_shift_range  = 0.1,
    height_shift_range = 0.1,
    shear_range        = 0.1,
    fill_mode          = "nearest",
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

print("\n[INFO] Loading training data …")
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size = IMG_SIZE,
    batch_size  = BATCH_SIZE,
    class_mode  = "categorical",
    classes     = CLASS_NAMES,
    shuffle     = True,
    seed        = SEED,
)

print("[INFO] Loading validation data …")
val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size = IMG_SIZE,
    batch_size  = BATCH_SIZE,
    class_mode  = "categorical",
    classes     = CLASS_NAMES,
    shuffle     = False,
)

print(f"\n[INFO] Class indices : {train_generator.class_indices}")
print(f"[INFO] Training   samples : {train_generator.samples}")
print(f"[INFO] Validation samples : {val_generator.samples}")

# Explicit step counts help avoid TensorFlow step inference warnings.
steps_per_epoch = max(1, train_generator.samples // BATCH_SIZE)
validation_steps = max(1, val_generator.samples // BATCH_SIZE)

# ─── Model Architecture ───────────────────────────────────────────────────────
print("\n[INFO] Building MobileNetV2 model …")

# If ImageNet weights cannot be downloaded (offline/network restrictions),
# fall back to random initialization so training can still proceed.
try:
    base_model = MobileNetV2(
        input_shape = (*IMG_SIZE, 3),
        include_top = False,
        weights     = "imagenet",
    )
    print("[INFO] Loaded MobileNetV2 ImageNet weights.")
except Exception as exc:
    print("[WARN] Could not download/load ImageNet weights.")
    print(f"[WARN] Reason: {exc}")
    print("[WARN] Falling back to weights=None (training from scratch).")
    base_model = MobileNetV2(
        input_shape = (*IMG_SIZE, 3),
        include_top = False,
        weights     = None,
    )
base_model.trainable = False   # freeze base for Phase 1

x       = base_model.output
x       = GlobalAveragePooling2D()(x)
x       = Dropout(0.3)(x)
x       = Dense(128, activation="relu")(x)
x       = Dropout(0.2)(x)
outputs = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

model.compile(
    optimizer = "adam",
    loss      = "categorical_crossentropy",
    metrics   = ["accuracy"],
)

model.summary()

# ─── Callbacks ────────────────────────────────────────────────────────────────
def build_callbacks(monitor: str = "val_accuracy") -> list:
    return [
        ModelCheckpoint(
            filepath        = MODEL_PATH,
            monitor         = monitor,
            save_best_only  = True,
            verbose         = 1,
        ),
        EarlyStopping(
            monitor              = monitor,
            patience             = 5,
            restore_best_weights = True,
            verbose              = 1,
        ),
        ReduceLROnPlateau(
            monitor  = "val_loss",
            factor   = 0.5,
            patience = 3,
            min_lr   = 1e-7,
            verbose  = 1,
        ),
    ]

# ─── Phase 1: Train the classification head ───────────────────────────────────
print("\n" + "=" * 60)
print("  Phase 1 – Training classification head (base frozen)")
print("=" * 60)

history_top = model.fit(
    train_generator,
    validation_data = val_generator,
    epochs          = EPOCHS_TOP,
    steps_per_epoch = steps_per_epoch,
    validation_steps = validation_steps,
    callbacks       = build_callbacks("val_accuracy"),
)

# ─── Phase 2: Fine-tune the last 30 layers of MobileNetV2 ────────────────────
print("\n" + "=" * 60)
print("  Phase 2 – Fine-tuning last 30 layers of MobileNetV2")
print("=" * 60)

base_model.trainable = True
freeze_until = len(base_model.layers) - 30
for layer in base_model.layers[:freeze_until]:
    layer.trainable = False

model.compile(
    optimizer = tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss      = "categorical_crossentropy",
    metrics   = ["accuracy"],
)

history_fine = model.fit(
    train_generator,
    validation_data = val_generator,
    epochs          = EPOCHS_FINE,
    steps_per_epoch = steps_per_epoch,
    validation_steps = validation_steps,
    callbacks       = build_callbacks("val_accuracy"),
)

# ─── Save final model ─────────────────────────────────────────────────────────
model.save(MODEL_PATH)
print(f"\n[INFO] Final model saved → {MODEL_PATH}")

# ─── Plotting Utility ─────────────────────────────────────────────────────────
def plot_training_history(history, title: str, filename: str) -> None:
    acc      = history.history["accuracy"]
    val_acc  = history.history["val_accuracy"]
    loss     = history.history["loss"]
    val_loss = history.history["val_loss"]
    epochs   = range(1, len(acc) + 1)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.suptitle(title, fontsize=14, fontweight="bold")

    # Accuracy subplot
    axes[0].plot(epochs, acc,     "b-o", label="Training Accuracy")
    axes[0].plot(epochs, val_acc, "r-o", label="Validation Accuracy")
    axes[0].set_title("Accuracy")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].legend()
    axes[0].grid(True)

    # Loss subplot
    axes[1].plot(epochs, loss,     "b-o", label="Training Loss")
    axes[1].plot(epochs, val_loss, "r-o", label="Validation Loss")
    axes[1].set_title("Loss")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].legend()
    axes[1].grid(True)

    plt.tight_layout()
    save_path = os.path.join(MODEL_DIR, filename)
    plt.savefig(save_path, dpi=150)
    plt.show()
    print(f"[INFO] Plot saved → {save_path}")


plot_training_history(
    history_top,
    title    = "Phase 1 – Classification Head Training",
    filename = "history_phase1_top_layers.png",
)

plot_training_history(
    history_fine,
    title    = "Phase 2 – Fine-Tuning",
    filename = "history_phase2_fine_tuning.png",
)

history_file = os.path.join(MODEL_DIR, "training_history.json")
with open(history_file, "w", encoding="utf-8") as f:
    json.dump(history_fine.history, f, indent=2)
print(f"[INFO] Training history saved → {history_file}")

# ─── Training Summary ─────────────────────────────────────────────────────────
final_train_acc = history_fine.history["accuracy"][-1]
final_val_acc   = history_fine.history["val_accuracy"][-1]
final_train_loss = history_fine.history["loss"][-1]
final_val_loss   = history_fine.history["val_loss"][-1]

print("\n" + "=" * 60)
print("  Training Summary")
print("=" * 60)
print(f"  Training   Accuracy : {final_train_acc  * 100:.2f} %")
print(f"  Validation Accuracy : {final_val_acc    * 100:.2f} %")
print(f"  Training   Loss     : {final_train_loss:.4f}")
print(f"  Validation Loss     : {final_val_loss:.4f}")
print("-" * 60)
print("  Market Grade Mapping")
print("-" * 60)
for cls, grade in GRADE_MAP.items():
    print(f"    {cls:<10} →  {grade}")
print("=" * 60)
print("\n[INFO] Training complete. Run evaluate_model.py for full metrics.")
