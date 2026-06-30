import os
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


class PredictionPipeline:

    def __init__(self):
        self.model = load_model(
            os.path.join("artifacts", "training", "model.h5"),
            compile=False
        )

    def predict(self, filename):

        test_image = image.load_img(
            filename,
            target_size=(224, 224)
        )

        test_image = image.img_to_array(test_image)
        test_image = np.expand_dims(test_image, axis=0)

        result = np.argmax(
            self.model.predict(test_image, verbose=0),
            axis=1
        )

        prediction = "Healthy" if result[0] == 1 else "Coccidiosis"

        return [{"image": prediction}]