var $coverimage, $dragger, $loading, $sizer, $uploading, $userimage, createImage, getBackgroundCenterPoint, getBackgroundImage, getBackgroundPosition, getBackgroundSize, getImgSize, handleDragOver, handleFileSelect, loadImage, px2int, resizeDragger;

$userimage = $('#user_image .inner');

$coverimage = $('#cover_image .inner');

$dragger = $('#dragger');

$sizer = $('#size_slider');

$loading = $('#loading');

$uploading = $('#uploading');

createImage = function(template, source, x, y, w, h) {
  var base64, cover, ctx, html, msie, resize_canvas, tab, ua, userimage;
  cover = new Image;
  cover.src = 'images/flag/' + template + '.png';
  userimage = new Image;
  userimage.src = source;
  resize_canvas = document.getElementById('result');
  resize_canvas.width = 500;
  resize_canvas.height = 500;
  ctx = resize_canvas.getContext('2d');
  ctx.rect(0, 0, 500, 500);
  ctx.fillStyle = '#CCCCCC';
  ctx.fill();
  ctx.drawImage(userimage, x, y, w, h);
  ctx.drawImage(cover, 0, 0, 500, 500);
  base64 = resize_canvas.toDataURL('image/png');
  ua = window.navigator.userAgent;
  msie = ua.indexOf('MSIE ');
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    html = '<p>Right click to save image.</p>';
    html += '<img src=\'' + base64 + '\' alt=\'7\'/>';
    tab = window.open();
    return tab.document.write(html);
  } else {
    $('#download').attr('href', base64);
    return $('#download')[0].click();
  }
};

handleFileSelect = function(evt) {
  var files;
  evt.stopPropagation();
  evt.preventDefault();
  files = evt.dataTransfer.files;
  return loadImage(files);
};

handleDragOver = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  return evt.dataTransfer.dropEffect = 'copy';
};

loadImage = function(files) {
  var createImage;
  var file, fr, imageLoaded, img;
  file = void 0;
  fr = void 0;
  img = void 0;
  createImage = function() {
    img = new Image;
    img.onload = imageLoaded;
    img.src = fr.result;
  };
  imageLoaded = function() {
    var ctx;
    var base64, canvas, ctx, thumb, thumb_h, thumb_w, thumbbase64;
    canvas = document.getElementById('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    base64 = canvas.toDataURL('image/png');
    $('#source').attr('src', base64);
    $userimage.css('background-image', 'url(' + base64 + ')');
    thumb = document.getElementById('thumb');
    thumb_w = void 0;
    thumb_h = void 0;
    if (img.width > img.height) {
      thumb_h = 100;
      thumb_w = 100 * img.width / img.height;
    } else {
      thumb_w = 100;
      thumb_h = 100 * img.height / img.width;
    }
    thumb.width = thumb_w;
    thumb.height = thumb_h;
    ctx = thumb.getContext('2d');
    ctx.drawImage(img, 0, 0, thumb_w, thumb_h);
    thumbbase64 = thumb.toDataURL('image/png');
    $('#templates label').css('background-image', 'url(' + thumbbase64 + ')');
    return $('<img/>').attr('src', base64).load(function() {
      var container_size, userimage_size, value;
      value = $('input[name=template]:checked').val();
      container_size = $userimage.width();
      userimage_size = [this.width, this.height];
      resizeDragger(userimage_size, container_size, value);
      $loading.hide();
      return $uploading.fadeOut();
    });
  };
  if (!files) {
    return alert('Sorry, your browser does not support load image.');
  } else {
    $uploading.fadeIn();
    $loading.show();
    file = files[0];
    fr = new FileReader;
    fr.onload = createImage;
    return fr.readAsDataURL(file);
  }
};

getImgSize = function(src) {
  var newImg;
  newImg = new Image;
  newImg.src = src;
  return [newImg.width, newImg.height];
};

getBackgroundImage = function(element) {
  var url;
  url = element.css('background-image');
  return url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
};

resizeDragger = function(size, wrapper, value, upload) {
  var height, left, scale, top, width;
  value = typeof value !== 'undefined' ? value : 1;
  upload = typeof upload !== 'undefined' ? upload : 0;
  scale = void 0;
  width = void 0;
  height = void 0;
  top = void 0;
  left = void 0;
  if (size[0] > size[1]) {
    scale = wrapper / size[1];
    width = size[0] * scale;
    height = wrapper;
    top = 0;
    left = (width - wrapper) * 0.5 * -1;
  } else {
    scale = wrapper / size[0];
    width = wrapper;
    height = size[1] * scale;
    top = (height - wrapper) * 0.5 * -1;
    left = 0;
  }
  if (value === 6) {
    left = wrapper * 0.2 * -1;
    if (size[0] > size[1]) {
      left -= (width - wrapper) * 0.5;
    }
  } else if (value === 9) {
    $sizer.slider('value', 65);
    if (size[0] > size[1]) {
      left = wrapper * 0.65 * 0.13 * 0.5;
      width *= 0.65;
      height *= 0.65;
      top = (wrapper - height) * 0.48;
    } else {
      left = wrapper * 0.65 * 0.13 * 0.5;
      width *= 0.65;
      height *= 0.65;
      top = (wrapper - height) * 0.48;
    }
  } else if (value === 10) {
    $sizer.slider('value', 92);
    if (size[0] > size[1]) {
      width = wrapper * 0.92;
      height = width * size[1] / size[0];
      top = wrapper * 0.045;
      left = (wrapper - width) * 0.5;
    } else {
      width = width * 0.92;
      height = height * 0.92;
      top = wrapper * 0.045;
      left = (wrapper - width) * 0.5;
    }
  }
  $dragger.css('width', width + 'px').css('height', height + 'px').css('top', top + 'px').css('left', left + 'px');
  return $userimage.css('background-size', width + 'px ' + height + 'px').css('background-position', left + 'px ' + top + 'px');
};

getBackgroundSize = function(string) {
  var size;
  size = string.split(' ');
  return [px2int(size[0]), px2int(size[1])];
};

getBackgroundPosition = function(string) {
  var position;
  position = string.split(' ');
  return [px2int(position[0]), px2int(position[1])];
};

getBackgroundCenterPoint = function(size, position) {
  return [size[0] * 0.5 + position[0], size[1] * 0.5 + position[1]];
};

px2int = function(string) {
  return parseFloat(string.replace('px', ''));
};

$(window).load(function() {
  var active, container_size, html, i, j, userimage_size;
  for (i = j = 1; j <= 24; i = ++j) {
    if (i === 1) {
      active = ' active';
    } else {
      active = '';
    }
    html = '<label class="template-label ' + active + '" style="background-image: url(images/sample.jpg);"><img src="images/flag/' + i + '.png"><input type="radio" name="template" value="' + i + '" autocomplete="off" checked="checked"></label>';
    $('#templates').append(html);
  }
  container_size = $userimage.width();
  userimage_size = getImgSize(getBackgroundImage($userimage));
  return resizeDragger(userimage_size, container_size);
});

$(document).ready(function() {
  var dropZone;
  $('body').iealert({
    support: 'ie9',
    closeBtn: false,
    upgradeTitle: 'Download Google Chrome',
    upgradeLink: 'http://www.google.com/chrome/'
  });
  $dragger.draggable({
    drag: function(event) {
      var value;
      $userimage.css('background-position', $dragger.css('left') + ' ' + $dragger.css('top'));
      if ($userimage.hasClass('dragged') === false) {
        $userimage.addClass('dragged');
      }
      value = $('input[name=template]:checked').val();
      if (value === 9 || value === 10) {
        return $userimage.attr('class', 'inner');
      }
    }
  });
  $sizer.slider({
    value: 100,
    max: 170,
    min: 30,
    slide: function(event, ui) {
      var center, position, truesize;
      truesize = getBackgroundSize($userimage.css('background-size'));
      position = getBackgroundPosition($userimage.css('background-position'));
      center = getBackgroundCenterPoint(truesize, position);
      return $('<img/>').attr('src', getBackgroundImage($userimage)).load(function() {
        var height, left, size, top, width;
        size = [this.width, this.height];
        width = size[0] * ui.value / 100;
        height = size[1] * ui.value / 100;
        left = center[0] - (width * 0.5);
        top = center[1] - (height * 0.5);
        $dragger.css('width', width + 'px').css('height', height + 'px').css('top', top + 'px').css('left', left + 'px');
        return $userimage.css('background-size', width + 'px ' + height + 'px').css('background-position', left + 'px ' + top + 'px');
      });
    }
  });
  $('body').delegate('#templates', 'mouseover', function() {
    return $('#dashboard_container').css('overflow-y', 'hidden');
  });
  $('body').delegate('#templates', 'mouseout', function() {
    return $('#dashboard_container').css('overflow-y', 'auto');
  });
  $('body').delegate('input[name=template]', 'change', function() {
    var url, value, width;
    $('.template-label').removeClass('active');
    $(this).parents('.template-label').addClass('active');
    width = void 0;
    value = $(this).val();
    url = 'images/flag/' + value + '.png';
    $coverimage.css('background-image', 'url(' + url + ')');
    $('#cover_image img').attr('src', url);
    if ($userimage.hasClass('dragged') === true) {
      $userimage.attr('class', 'inner dragged');
    } else {
      $userimage.attr('class', 'inner');
    }
    return $('<img/>').attr('src', getBackgroundImage($userimage)).load(function() {
      var container_size, size;
      size = [this.width, this.height];
      container_size = $userimage.width();
      return resizeDragger(size, container_size, value);
    });
  });
  $('#download_button').click(function() {
    var basesize, h, position, scale, size, source, template, w, x, y;
    basesize = $userimage.width();
    size = getBackgroundSize($userimage.css('background-size'));
    position = getBackgroundPosition($userimage.css('background-position'));
    scale = basesize / 500;
    template = $('input[name=template]:checked').val();
    source = $('#source').attr('src');
    w = size[0] / scale;
    h = size[1] / scale;
    x = position[0] / scale;
    y = position[1] / scale;
    return createImage(template, source, x, y, w, h);
  });
  dropZone = document.getElementById('drop');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
  $('.upload-button').click(function() {
    return $('#upload_input').click();
  });
  return $('#upload_input').on('change', function() {
    var input;
    input = document.getElementById('upload_input');
    console.log(input.files);
    return loadImage(input.files);
  });
});
