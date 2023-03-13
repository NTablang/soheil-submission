from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask.helpers import send_from_directory
import cv2
import numpy as np
from skimage import io, filters, transform, exposure
import requests
import urllib.request
from PIL import Image
from io import BytesIO
import base64


app = Flask(__name__, static_folder="../build")
CORS(app)



# allow this route to take in a POST request with the image url and mean and std as data
@app.route("/add_noise_blue", methods=["POST"])
@cross_origin()
def add_noise_blue():
    # Get the image file from the request
    image_file = request.files['image']
    
    # Load the image using scikit-image
    image = io.imread(image_file)

    # Get the mean and standard deviation from the request
    mean = float(request.form['mean'])
    std = float(request.form['std'])
    print("mean: [", mean, "]")
    print("std: [", std, "]")
    print("img shape: [", image.shape, "]")

    # Generate Gaussian noise with the given mean and standard deviation
    noise = np.random.normal(mean, std, image.shape)

    # Add the noise to the image
    noisy_image = np.clip(image + noise, 0, 255).astype(np.uint8)

    # Convert the noisy image to bytes
    _, buffer = cv2.imencode('.jpg', noisy_image)
    noisy_image_base64 = base64.b64encode(buffer).decode('utf-8')

    content_type = 'image/jpeg'
    # Return the modified image as a response
    response = {'image': noisy_image_base64}
    return response, 200, {'content-type': content_type}


@app.route("/add_blur_blue", methods=["POST"])
@cross_origin()
def add_blur_blue():
    # Get the image file from the request
    image_file = request.files['image']
    
    # Load the image using scikit-image
    image = io.imread(image_file)

    # Get the kernel size for Gaussian blur from the request
    ksize = int(request.form['ksize'])
    print("Kernel size: [", ksize, "]")
    print("img shape: [", image.shape, "]")

   # Apply Gaussian blur to the image
    blurred_image = filters.gaussian(image, sigma=ksize)

    # Convert the blurred image to bytes
    blurred_image = (255 * blurred_image).astype(np.uint8)
    _, buffer = cv2.imencode('.jpg', blurred_image)
    blurred_image_base64 = base64.b64encode(buffer).decode('utf-8')

    content_type = 'image/jpeg'
    # Return the modified image as a response
    response = {'image': blurred_image_base64}
    return response, 200, {'content-type': content_type}


@app.route("/add_green_tint", methods=["POST"])
@cross_origin()
def add_green_tint():
    # Get the image file from the request
    image_file = request.files['image']
    
    # Load the image using scikit-image
    image = io.imread(image_file)

    # Apply greenish tint to the image
    tinted_image = image.copy()
    tinted_image[:, :, 0] = 0  # Set blue channel to 0
    tinted_image[:, :, 2] = 0  # Set red channel to 0
    tinted_image[:, :, 1] = tinted_image[:, :, 1] * 1.5  # Increase green channel

    # Convert the tinted image to bytes
    _, buffer = cv2.imencode('.jpg', tinted_image)
    tinted_image_base64 = base64.b64encode(buffer).decode('utf-8')

    content_type = 'image/jpeg'
    # Return the modified image as a response
    response = {'image': tinted_image_base64}
    return response, 200, {'content-type': content_type}


@app.route("/add_brightness", methods=["POST"])
@cross_origin()
def add_brightness():
    # Get the image file from the request
    image_file = request.files['image']
    
    # Load the image using scikit-image
    image = io.imread(image_file)

    # Get the brightness and contrast values from the request
    brightness = float(request.form['brightness'])
    print("brightness: [", brightness, "]")
    print("img shape: [", image.shape, "]")

    # Apply brightness and contrast adjustments to the image
    adjusted_image = exposure.adjust_gamma(image, brightness)
    adjusted_image = exposure.rescale_intensity(adjusted_image, in_range=(np.percentile(adjusted_image, 0.5), np.percentile(adjusted_image, 99.5)), out_range=(0, 255))

    # Convert the adjusted image to bytes
    _, buffer = cv2.imencode('.jpg', adjusted_image)
    adjusted_image_base64 = base64.b64encode(buffer).decode('utf-8')

    content_type = 'image/jpeg'
    # Return the modified image as a response
    response = {'image': adjusted_image_base64}
    return response, 200, {'content-type': content_type}

@app.route("/hello_world", methods=["GET"])
@cross_origin()
def hello_world():
    return "Hello World!"


@app.route("/")
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run()
