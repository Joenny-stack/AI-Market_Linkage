import json
import os

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import tensorflow as tf
from sklearn.metrics import (accuracy_score, auc, classification_report,
                             confusion_matrix, precision_recall_fscore_support,
                             roc_curve)
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

MODEL_PATH = os.path.join(BASE_DIR, "model", "tomato_classifier.h5")
VAL_DIR = os.path.join(PROJECT_DIR, "dataset", "val")
OUTPUT_DIR = os.path.join(BASE_DIR, "model")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

CLASS_NAMES = ["Damaged", "Old", "Ripe", "Unripe"]


def save_figure(file_name: str) -> None:
    file_path = os.path.join(OUTPUT_DIR, file_name)
    plt.tight_layout()
    plt.savefig(file_path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"[INFO] Saved plot: {file_path}")


def plot_confusion_matrices(y_true: np.ndarray, y_pred: np.ndarray) -> None:
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(7, 6))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=CLASS_NAMES,
        yticklabels=CLASS_NAMES,
    )
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Tomato Quality Confusion Matrix")
    save_figure("confusion_matrix.png")

    cm_norm = confusion_matrix(y_true, y_pred, normalize="true")
    plt.figure(figsize=(7, 6))
    sns.heatmap(
        cm_norm,
        annot=True,
        fmt=".2f",
        cmap="Greens",
        xticklabels=CLASS_NAMES,
        yticklabels=CLASS_NAMES,
        vmin=0.0,
        vmax=1.0,
    )
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Normalized Confusion Matrix")
    save_figure("confusion_matrix_normalized.png")


def plot_class_distribution(y_true: np.ndarray) -> None:
    counts = np.bincount(y_true, minlength=len(CLASS_NAMES))
    plt.figure(figsize=(8, 5))
    bars = plt.bar(CLASS_NAMES, counts, color=["#c0392b", "#8e44ad", "#27ae60", "#f39c12"])
    plt.title("Class Distribution in Validation Dataset")
    plt.ylabel("Number of Images")
    for bar, value in zip(bars, counts):
        plt.text(bar.get_x() + bar.get_width() / 2, value + 1, str(value), ha="center", va="bottom")
    save_figure("class_distribution.png")


def plot_confidence_histogram(confidence: np.ndarray) -> None:
    plt.figure(figsize=(8, 5))
    plt.hist(confidence, bins=20, color="#2980b9", edgecolor="black", alpha=0.8)
    plt.title("Prediction Confidence Distribution")
    plt.xlabel("Confidence")
    plt.ylabel("Frequency")
    save_figure("prediction_confidence_histogram.png")


def plot_roc_curves(y_true: np.ndarray, predictions: np.ndarray) -> None:
    plt.figure(figsize=(8, 6))
    for idx, class_name in enumerate(CLASS_NAMES):
        binary_true = (y_true == idx).astype(int)
        fpr, tpr, _ = roc_curve(binary_true, predictions[:, idx])
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, linewidth=2, label=f"{class_name} (AUC={roc_auc:.3f})")

    plt.plot([0, 1], [0, 1], "k--", linewidth=1)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curves (One-vs-Rest)")
    plt.legend(loc="lower right")
    save_figure("roc_curves.png")


def plot_metric_bars(y_true: np.ndarray, y_pred: np.ndarray) -> None:
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, labels=list(range(len(CLASS_NAMES))), zero_division=0
    )
    x = np.arange(len(CLASS_NAMES))
    width = 0.25

    plt.figure(figsize=(10, 5))
    plt.bar(x - width, precision, width=width, label="Precision", color="#3498db")
    plt.bar(x, recall, width=width, label="Recall", color="#2ecc71")
    plt.bar(x + width, f1, width=width, label="F1-score", color="#e67e22")
    plt.xticks(x, CLASS_NAMES)
    plt.ylim(0, 1.05)
    plt.ylabel("Score")
    plt.title("Per-Class Precision, Recall, and F1-score")
    plt.legend()
    save_figure("per_class_metrics.png")


def plot_image_grid(
    indices: np.ndarray,
    filepaths: list,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    confidence: np.ndarray,
    title: str,
    file_name: str,
    max_images: int = 9,
) -> None:
    if len(indices) == 0:
        print(f"[WARN] No images available for plot: {file_name}")
        return

    chosen = indices[:max_images]
    cols = 3
    rows = int(np.ceil(len(chosen) / cols))
    plt.figure(figsize=(12, 4 * rows))
    plt.suptitle(title, fontsize=14)

    for plot_idx, sample_idx in enumerate(chosen):
        image = load_img(filepaths[sample_idx], target_size=IMG_SIZE)
        image = img_to_array(image) / 255.0

        pred_name = CLASS_NAMES[y_pred[sample_idx]]
        true_name = CLASS_NAMES[y_true[sample_idx]]
        conf = confidence[sample_idx]
        is_correct = y_pred[sample_idx] == y_true[sample_idx]
        color = "green" if is_correct else "red"

        plt.subplot(rows, cols, plot_idx + 1)
        plt.imshow(image)
        plt.title(f"P:{pred_name} | T:{true_name}\nConf:{conf:.2f}", color=color, fontsize=10)
        plt.axis("off")

    save_figure(file_name)


def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

    if not os.path.isdir(VAL_DIR):
        raise FileNotFoundError(f"Validation dataset directory not found at: {VAL_DIR}")

    print("[INFO] Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    datagen = ImageDataGenerator(rescale=1.0 / 255)
    generator = datagen.flow_from_directory(
        VAL_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        classes=CLASS_NAMES,
        shuffle=False,
    )

    print("[INFO] Running predictions on validation set...")
    predictions = model.predict(generator, verbose=1)

    y_pred = np.argmax(predictions, axis=1)
    y_true = generator.classes
    confidence = np.max(predictions, axis=1)

    accuracy = accuracy_score(y_true, y_pred)
    precision_w, recall_w, f1_w, _ = precision_recall_fscore_support(
        y_true, y_pred, average="weighted", zero_division=0
    )

    print("\nClassification Report\n")
    print(classification_report(y_true, y_pred, target_names=CLASS_NAMES, zero_division=0))
    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision_w:.4f} (weighted)")
    print(f"Recall   : {recall_w:.4f} (weighted)")
    print(f"F1-score : {f1_w:.4f} (weighted)")

    metrics_payload = {
        "accuracy": float(accuracy),
        "precision_weighted": float(precision_w),
        "recall_weighted": float(recall_w),
        "f1_weighted": float(f1_w),
        "classification_report": classification_report(
            y_true, y_pred, target_names=CLASS_NAMES, zero_division=0, output_dict=True
        ),
    }
    metrics_path = os.path.join(OUTPUT_DIR, "evaluation_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as fp:
        json.dump(metrics_payload, fp, indent=2)
    print(f"[INFO] Saved metrics: {metrics_path}")

    plot_confusion_matrices(y_true, y_pred)
    plot_class_distribution(y_true)
    plot_confidence_histogram(confidence)
    plot_roc_curves(y_true, predictions)
    plot_metric_bars(y_true, y_pred)

    correct_indices = np.where(y_pred == y_true)[0]
    incorrect_indices = np.where(y_pred != y_true)[0]

    # Highest-confidence correct predictions are useful for qualitative examples.
    correct_sorted = correct_indices[np.argsort(confidence[correct_indices])[::-1]]
    # Highest-confidence mistakes are useful error analysis examples.
    incorrect_sorted = incorrect_indices[np.argsort(confidence[incorrect_indices])[::-1]]

    plot_image_grid(
        indices=correct_sorted,
        filepaths=generator.filepaths,
        y_true=y_true,
        y_pred=y_pred,
        confidence=confidence,
        title="Grid of Correct Predictions",
        file_name="correct_predictions_grid.png",
    )
    plot_image_grid(
        indices=incorrect_sorted,
        filepaths=generator.filepaths,
        y_true=y_true,
        y_pred=y_pred,
        confidence=confidence,
        title="Grid of Misclassified Images",
        file_name="misclassified_images_grid.png",
    )

    print("\n[INFO] Evaluation completed.")
    print(f"[INFO] All outputs saved in: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()