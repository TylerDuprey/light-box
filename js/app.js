// Establish global variables
var htmlTag = document.getElementsByTagName("html")[0];
var body = document.getElementsByTagName("body")[0];
var lightboxContainer = document.getElementById("lightbox");
var lightboxWrap = document.querySelector(".slide-box");
var gallery = document.getElementById("gallery");
var search = document.getElementById("search");
var url = "data/data.json";
var obf = document.getElementById("obfuscator");

// List Constructor code: 
function List() {
  this.items = [];
  this.nowDisplayingIndex = 0;
}

List.prototype.add = function(item) {
  this.items.push(item);
};

List.prototype.display = function(number) {
  // Code to set item to display (review video)
  for(var i=0;i<this.items.length;i++) {
    if(this.items[i].idNumber === number) {
      this.items[i].display = true;
      this.nowDisplayingIndex = i;
    }
  }
};

List.prototype.play = function() {
  var currentLightboxItem = this.items[this.nowDisplayingIndex];
  currentLightboxItem.play();
};

List.prototype.stop = function() {
  var currentLightboxItem = this.items[this.nowDisplayingIndex];
  currentLightboxItem.stop();
};

List.prototype.next = function(item) {
  if(this.nowDisplayingIndex + 1 < this.items.length) {
    this.nowDisplayingIndex++;
  } else {
    this.nowDisplayingIndex = 0;
  }
};

List.prototype.prev = function(item) {
  // Code to display previous (review video)
  if(this.nowDisplayingIndex > 0) {
    this.nowDisplayingIndex--;
  } else {
    this.nowDisplayingIndex = this.items.length - 1;
  }
};

List.prototype.renderInLightbox = function(list) {
  list.innerHTML = "";

  for(let i=0;i<this.items.length;i++) {
    list.innerHTML += this.items[i].toLightboxHTML();
  }
};

List.prototype.renderInElement = function(list) {
  list.innerHTML = "";
  for(let i=0;i<this.items.length;i++) {
    list.innerHTML += this.items[i].toHTMLItem();
  }
};

// Media Inheritance Constructor:
function Media(id,path,title,caption,isShowing,type) {
  this.idNumber = id;
  this.path = path;
	this.title = title;
	this.caption = caption;
  this.type = type;
  this.isShowing = true;
  this.display = false;
}

Media.prototype.play = function() {
  // Code to display next (review video)
  this.display = true;
};

Media.prototype.stop = function() {
  // Code to display next (review video)
  this.display = false;
};

Media.prototype.show = function() {
  // Code to display next (review video)
  this.isShowing = true;
};

Media.prototype.hide = function() {
  // Code to display next (review video)
  this.isShowing = false;
};

// Item Constructor code: 
function Item(id,path,thumb,title,caption,isShowing,type) {
  Media.call(this,id,path,title,caption,isShowing,type);
	this.thumb = thumb;
}

// Setup the prototype chain with the Media constructor
Item.prototype = Object.create(Media.prototype);

// Setup specific toHTML method just for images
Item.prototype.toHTMLItem = function() {
  var htmlString = "";
  htmlString = `<li id="${this.idNumber}" class="showing"><a href="${this.path}">`+ 
//    <img src="${this.thumb}" />
    `</a><div class="captions">${this.title}${this.caption}</div></li>`;

  return htmlString;
};

Item.prototype.toLightboxHTML = function() {
  var htmlString = "";
  htmlString = `<input id="slide-1-trigger" class="slide-input" type="radio" name="slides">
          <artice class="slide">
            <div class="slide-image" style="background-image: url('${this.path}')">
            </div>
            <footer class="slide-text">
              <p>${this.caption}</p>
            </footer>
          </artice>`;
  return htmlString;
};

// Video Constructor code: 
function Video(id,path,tubeId,title,caption,isShowing,type) {
  Media.call(this,id,path,title,caption,isShowing,type);
	this.tubeId = tubeId;
}

// Setup the prototype chain with the Media constructor
Video.prototype = Object.create(Media.prototype);

// Setup the prototype chain with the Media constructor
Video.prototype = Object.create(Media.prototype);

// Setup specific toHTML method just for video
Video.prototype.toHTMLItem = function() {
  var htmlString = "";
  htmlString = `<li id="${this.idNumber}" class="showing"><a href="#">` + 
//    <iframe width="200" height="113" src="${this.path + this.tubeId}?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
  `</a>` + 
//    <button>Watch Video</button>
  `<div class="captions">${this.title}${this.caption}</div></li>`;
  
  return htmlString;
};

Video.prototype.toLightboxHTML = function() {
  var htmlString = "";
  htmlString = `<input id="slide-1-trigger" class="slide-input" type="radio" name="slides">
          <artice class="slide">
            <div class="slide-image">` +
//              <iframe width="560" height="315" src="${this.path + this.tubeId}" frameborder="0" allowfullscreen></iframe>
            `</div>
            <footer class="slide-text">
              <p>${this.caption}</p>
            </footer>
          </artice>`;
  return htmlString;
};

// handles all functionality with the media gallery
var galleryControls = function(data) {
  var galleryList = new List();
  //Print the list to the page
  $.each(data,function(index,item) {
    if(item.type === 'image') {
      galleryList.add(new Item(item.idNumber, item.path + item.name, item.thumb + item.name, item.title,item.caption,item.isShowing,item.type));
    } else if (this.type === 'video') {
      galleryList.add(new Video(item.idNumber, item.path, item.tubeId, item.title,item.caption,item.isShowing,item.type));
    }
  });
  
  galleryList.renderInElement(gallery);

  // When called, return the value in the search box
  var getSearch = function() {
    return search.value.toUpperCase();
  };
  
  // When called, filter Media on page and in main list 
  var filterMedia = function() {
    // Code for filtering
    for(let i=0;i<gallery.children.length;i++) {
      var textContent = gallery.children[i].textContent.toUpperCase();
      var match = textContent.includes(getSearch());
      var item = gallery.children[i];
      // Sort out matches from non matches, show or hide then update global array
      if (match) {
        $(item).show('slow');
        galleryList.items[i].show();
      } else {
        $(item).hide('slow');
        galleryList.items[i].hide();
      }
    } 
  };
  
  // As user types in the search box, call the filter function
  window.addEventListener('keyup',function() {
    filterMedia();
  });
	
	// When Called, show the lightbox and skip to the item selected 
	function launchLightBox() {
		lightboxContainer.style.display = 'flex';
		obf.style.display = 'inherit';
		htmlTag.style.overflow = 'hidden';
		body.style.overflow = 'hidden';
	}
  
  // If user clicks on an image, call the lightboxControls function
  gallery.addEventListener('click',function(event) {
    event.preventDefault();
    var tagName = event.target.tagName;
    var li = event.target.parentNode.parentNode;
    var id = li.getAttribute('id');
    // Make sure the user clicked an image in the gallery
    if(tagName === 'IMG' && li.parentNode === gallery) {
			launchLightBox();
      lightboxControls(galleryList.items, id); 
    } else if (tagName === 'BUTTON') {
			  launchLightBox();
				lightboxControls(galleryList.items, event.target.parentNode.getAttribute('id')); 	
		} else if (tagName === 'A') {
			  launchLightBox();
				lightboxControls(galleryList.items, event.target.getAttribute('id')); 
		}
  });
}; // end of gallery controls function

// Lightbox controls function
var lightboxControls = function(data,number) {
  var lightboxList = new List();
  // Loop through the data and build the lightboxList. 
  for(var i=0;i<data.length;i++) {
    var item = data[i];
    
    if(item.isShowing && item.type === 'image') {
      lightboxList.add(new Item(item.idNumber, item.path, item.thumb, item.title, item.caption, item.isShowing,item.type));
      if(item.idNumber === number) {
        lightboxList.display(item.idNumber);
      }
    } else if (item.isShowing && item.type === 'video') {
      lightboxList.add(new Video(item.idNumber, item.path, item.tubeId, item.title, item.caption, item.isShowing,item.type));
			
			if(item.idNumber === number) {
        lightboxList.display(item.idNumber);
      }
    }
  }
  
  lightboxList.renderInLightbox(lightboxWrap);
  
  var slides = document.querySelectorAll('.slide-input');
  slides[lightboxList.nowDisplayingIndex].checked = true;
  // Handle lightbox click event
  lightbox.addEventListener('click',function(event) {
    if(event.target.className === 'arrow-left') {
      lightboxList.stop();
      lightboxList.prev();
      slides[lightboxList.nowDisplayingIndex].checked = true;
      lightboxList.nowDisplayingIndex.play();
    } else if (event.target.className === 'arrow-right') {
      lightboxList.stop();
      lightboxList.next();
      lightboxList.play();
      slides[lightboxList.nowDisplayingIndex].checked = true;
    }
    
    if(event.target === lightbox) {
      lightbox.style.display = 'none';
      body.style.overflow = 'visible';
      htmlTag.style.overflow = 'visible';
      obf.style.display = 'none';
    }
  });
	
	window.onkeydown = function(event) {
		if(event.which === 39) {
			lightboxList.stop();
      lightboxList.next();
      lightboxList.play();
      slides[lightboxList.nowDisplayingIndex].checked = true;
		} else if (event.which === 37) {
			lightboxList.stop();
      lightboxList.prev();
      slides[lightboxList.nowDisplayingIndex].checked = true;
      lightboxList.nowDisplayingIndex.play();
		} else if (event.which === 27) {
			lightbox.style.display = 'none';
      body.style.overflow = 'visible';
      htmlTag.style.overflow = 'visible';
      obf.style.display = 'none';
		}
	};
}; // end of lightbox controls function

// Get the JSON and pass data to the gallery controls function
$.getJSON(url,galleryControls);









