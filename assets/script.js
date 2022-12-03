const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let photosArray = [];
let contentTotalHeight, innerHeight, verticalScroll;
const imagesInitialLoad = 3;
const imagesAfterFirstLoad = 10;
let allImagesLoaded = false;
let imagesLoaded = 0;
let totalImages = 0;

const UNSPLASH_PUBLIC_API_ACCESS_KEY = "BeNTmbYEdY9Xlz4gHeI9kuwRWDJAt7eHVk4dImQFGu8";
let unsplashUrl = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_PUBLIC_API_ACCESS_KEY}&count=${imagesInitialLoad}`;

/**
 * @dev After the first load, set a higher amount of photos to download
 */
function afterFirstLoad() {
  unsplashUrl = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_PUBLIC_API_ACCESS_KEY}&count=${imagesAfterFirstLoad}`;
}

/**
 * @dev Check if all images were loaded
 */
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    allImagesLoaded = true;
    loader.hidden = true;
    afterFirstLoad();
  }
}

/**
 * @dev
 */
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

/**
 * @dev Create Elements for Links & Photos, Add to DOM
 */
function displayPhotos() {
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "blank",
    });
    // Create image for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description || "No description available",
      title: photo.alt_description || "No description available",
    });
    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

/**
 * @dev Get photos from Unsplash API
 */
async function getPhotos() {
  try {
    const response = await fetch(unsplashUrl);
    photosArray = await response.json();
    totalImages += photosArray.length;
    console.log(`total images: ${totalImages}`);
    await displayPhotos();
  } catch (error) {
    console.error(error);
  }
}

// Check to see if scrolling near the bottom of the page, Load more photos
window.addEventListener("scroll", () => {
  contentTotalHeight = document.body.offsetHeight;
  verticalScroll = window.scrollY;
  innerHeight = window.innerHeight;

  if (allImagesLoaded && verticalScroll + innerHeight >= contentTotalHeight - 1000) {
    allImagesLoaded = false;
    getPhotos();
  }
});

// On load
getPhotos();
