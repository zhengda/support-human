$userimage = $('#user_image .inner')
$coverimage = $('#cover_image .inner')
$dragger = $('#dragger')
$sizer = $('#size_slider')
$loading = $('#loading')
$uploading = $('#uploading')

createImage = (template, source, x, y, w, h) ->
  cover = new Image
  cover.src = 'images/flag/' + template + '.png'
  userimage = new Image
  userimage.src = source
  resize_canvas = document.getElementById('result')
  resize_canvas.width = 500
  resize_canvas.height = 500
  ctx = resize_canvas.getContext('2d')
  ctx.rect 0, 0, 500, 500
  ctx.fillStyle = '#CCCCCC'
  ctx.fill()
  ctx.drawImage userimage, x, y, w, h
  ctx.drawImage cover, 0, 0, 500, 500
  base64 = resize_canvas.toDataURL('image/png')
  # check ie or not
  ua = window.navigator.userAgent
  msie = ua.indexOf('MSIE ')
  if msie > 0 or ! !navigator.userAgent.match(/Trident.*rv\:11\./)
    html = '<p>Right click to save image.</p>'
    html += '<img src=\'' + base64 + '\' alt=\'7\'/>'
    tab = window.open()
    tab.document.write html
  else
    $('#download').attr 'href', base64
    $('#download')[0].click()

handleFileSelect = (evt) ->
  evt.stopPropagation()
  evt.preventDefault()
  files = evt.dataTransfer.files
  loadImage files

handleDragOver = (evt) ->
  evt.stopPropagation()
  evt.preventDefault()
  evt.dataTransfer.dropEffect = 'copy'

loadImage = (files) ->
  `var createImage`
  file = undefined
  fr = undefined
  img = undefined

  createImage = ->
    img = new Image
    img.onload = imageLoaded
    img.src = fr.result
    return

  imageLoaded = ->
    `var ctx`
    canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    ctx = canvas.getContext('2d')
    ctx.drawImage img, 0, 0
    base64 = canvas.toDataURL('image/png')
    $('#source').attr 'src', base64
    $userimage.css 'background-image', 'url(' + base64 + ')'
    thumb = document.getElementById('thumb')
    thumb_w = undefined
    thumb_h = undefined
    if img.width > img.height
      thumb_h = 100
      thumb_w = 100 * img.width / img.height
    else
      thumb_w = 100
      thumb_h = 100 * img.height / img.width
    thumb.width = thumb_w
    thumb.height = thumb_h
    ctx = thumb.getContext('2d')
    ctx.drawImage img, 0, 0, thumb_w, thumb_h
    thumbbase64 = thumb.toDataURL('image/png')
    $('#templates label').css 'background-image', 'url(' + thumbbase64 + ')'
    $('<img/>').attr('src', base64).load ->
      value = $('input[name=template]:checked').val()
      container_size = $userimage.width()
      userimage_size = [
        @width
        @height
      ]
      resizeDragger userimage_size, container_size, value
      $loading.hide()
      $uploading.fadeOut()

  if !files
    alert 'Sorry, your browser does not support load image.'
  else
    $uploading.fadeIn()
    $loading.show()
    file = files[0]
    fr = new FileReader
    fr.onload = createImage
    fr.readAsDataURL file

getImgSize = (src) ->
  newImg = new Image
  newImg.src = src
  [
    newImg.width
    newImg.height
  ]

getBackgroundImage = (element) ->
  url = element.css('background-image')
  url.replace(/^url\(["']?/, '').replace /["']?\)$/, ''

resizeDragger = (size, wrapper, value, upload) ->
  value = if typeof value != 'undefined' then value else 1
  upload = if typeof upload != 'undefined' then upload else 0
  scale = undefined
  width = undefined
  height = undefined
  top = undefined
  left = undefined
  if size[0] > size[1]
    scale = wrapper / size[1]
    width = size[0] * scale
    height = wrapper
    top = 0
    left = (width - wrapper) * 0.5 * -1
  else
    scale = wrapper / size[0]
    width = wrapper
    height = size[1] * scale
    top = (height - wrapper) * 0.5 * -1
    left = 0
  if value == 6
    left = wrapper * 0.2 * -1
    if size[0] > size[1]
      left -= (width - wrapper) * 0.5
  else if value == 9
    $sizer.slider 'value', 65
    if size[0] > size[1]
      left = wrapper * 0.65 * 0.13 * 0.5
      width *= 0.65
      height *= 0.65
      top = (wrapper - height) * 0.48
    else
      left = wrapper * 0.65 * 0.13 * 0.5
      width *= 0.65
      height *= 0.65
      top = (wrapper - height) * 0.48
  else if value == 10
    $sizer.slider 'value', 92
    if size[0] > size[1]
      width = wrapper * 0.92
      height = width * size[1] / size[0]
      top = wrapper * 0.045
      left = (wrapper - width) * 0.5
    else
      width = width * 0.92
      height = height * 0.92
      top = wrapper * 0.045
      left = (wrapper - width) * 0.5
  $dragger.css('width', width + 'px').css('height', height + 'px').css('top', top + 'px').css 'left', left + 'px'
  $userimage.css('background-size', width + 'px ' + height + 'px').css 'background-position', left + 'px ' + top + 'px'

getBackgroundSize = (string) ->
  size = string.split(' ')
  [
    px2int(size[0])
    px2int(size[1])
  ]

getBackgroundPosition = (string) ->
  position = string.split(' ')
  [
    px2int(position[0])
    px2int(position[1])
  ]

getBackgroundCenterPoint = (size, position) ->
  [
    size[0] * 0.5 + position[0]
    size[1] * 0.5 + position[1]
  ]

px2int = (string) ->
  parseFloat string.replace('px', '')



$(window).load ->
  container_size = $userimage.width()
  userimage_size = getImgSize(getBackgroundImage($userimage))
  resizeDragger userimage_size, container_size

$(document).ready ->
  $('body').iealert
    support: 'ie9'
    closeBtn: false
    upgradeTitle: 'Download Google Chrome'
    upgradeLink: 'http://www.google.com/chrome/'

  $dragger.draggable drag: (event) ->
    $userimage.css 'background-position', $dragger.css('left') + ' ' + $dragger.css('top')
    if $userimage.hasClass('dragged') == false
      $userimage.addClass 'dragged'
    value = $('input[name=template]:checked').val()
    if value == 9 or value == 10
      $userimage.attr 'class', 'inner'

  $sizer.slider
    value: 100
    max: 170
    min: 30
    slide: (event, ui) ->
      truesize = getBackgroundSize($userimage.css('background-size'))
      position = getBackgroundPosition($userimage.css('background-position'))
      center = getBackgroundCenterPoint(truesize, position)
      $('<img/>').attr('src', getBackgroundImage($userimage)).load ->
        size = [
          @width
          @height
        ]
        width = size[0] * ui.value / 100
        height = size[1] * ui.value / 100
        left = center[0] - (width * 0.5)
        top = center[1] - (height * 0.5)
        $dragger.css('width', width + 'px').css('height', height + 'px').css('top', top + 'px').css 'left', left + 'px'
        $userimage.css('background-size', width + 'px ' + height + 'px').css 'background-position', left + 'px ' + top + 'px'

  $('body').delegate 'input[name=template]', 'change', ->
    $('.template-label').removeClass 'active'
    $(this).parents('.template-label').addClass 'active'
    width = undefined
    value = $(this).val()
    url = 'images/flag/' + value + '.png'
    $coverimage.css 'background-image', 'url(' + url + ')'
    if $userimage.hasClass('dragged') == true
      $userimage.attr 'class', 'inner dragged'
    else
      $userimage.attr 'class', 'inner'
    $('<img/>').attr('src', getBackgroundImage($userimage)).load ->
      size = [
        @width
        @height
      ]
      container_size = $userimage.width()
      resizeDragger size, container_size, value

  $('#download_button').click ->
    basesize = $userimage.width()
    size = getBackgroundSize($userimage.css('background-size'))
    position = getBackgroundPosition($userimage.css('background-position'))
    scale = basesize / 500
    template = $('input[name=template]:checked').val()
    source = $('#source').attr('src')
    w = size[0] / scale
    h = size[1] / scale
    x = position[0] / scale
    y = position[1] / scale
    createImage template, source, x, y, w, h

$ ->
  dropZone = document.getElementById('drop')
  dropZone.addEventListener 'dragover', handleDragOver, false
  dropZone.addEventListener 'drop', handleFileSelect, false
  $('.upload-button').click ->
    $('#upload_input').click()

  $('#upload_input').on 'change', ->
    input = document.getElementById('upload_input')
    console.log input.files
    loadImage input.files
