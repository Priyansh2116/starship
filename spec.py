from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

# Load the image
image_path = 'black.jpg'  # Replace with your image file path
image = Image.open(image_path)

# Convert the image to grayscale to analyze intensity
gray_image = image.convert("L")

# Convert grayscale image to numpy array
image_array = np.array(gray_image)

# Sum pixel intensities across the vertical axis (columns) to extract the spectrum
spectrum = np.sum(image_array, axis=0)

# Plot the spectrum
plt.figure(figsize=(10, 6))
plt.plot(spectrum, color='blue')
plt.title("Spectroscopy Graph")
plt.xlabel("Pixel Position (corresponding to wavelength)")
plt.ylabel("Intensity")
plt.grid()
plt.savefig("spectroscopy_ph.png")  # Save the graph as an image
print("Graph saved as spectroscopy_graph.png")


