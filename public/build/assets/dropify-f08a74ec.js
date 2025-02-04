import{c as d}from"./axios-338ce14d.js";import{r as u}from"./jquery-82f3099f.js";var g={exports:{}};/*!
 * =============================================================
 * dropify v0.2.1 - Override your input files with style.
 * https://github.com/JeremyFagis/dropify
 *
 * (c) 2017 - Jeremy FAGIS <jeremy@fagis.fr> (http://fagis.fr)
 * =============================================================
 */(function(f,m){(function(r,a){f.exports=a(u())})(d,function(r){var a="dropify";function i(e,t){if(window.File&&window.FileReader&&window.FileList&&window.Blob){var s={defaultFile:"",maxFileSize:0,minWidth:0,maxWidth:0,minHeight:0,maxHeight:0,showRemove:!0,showLoader:!0,showErrors:!0,errorTimeout:3e3,errorsPosition:"overlay",imgFileExtensions:["png","jpg","jpeg","gif","bmp"],maxFileSizePreview:"5M",allowedFormats:["portrait","square","landscape"],allowedFileExtensions:["*"],messages:{default:"Drag and drop a file here or click",replace:"Drag and drop or click to replace",remove:"Remove",error:"Ooops, something wrong happended."},error:{fileSize:"The file size is too big ({{ value }} max).",minWidth:"The image width is too small ({{ value }}}px min).",maxWidth:"The image width is too big ({{ value }}}px max).",minHeight:"The image height is too small ({{ value }}}px min).",maxHeight:"The image height is too big ({{ value }}px max).",imageFormat:"The image format is not allowed ({{ value }} only).",fileExtension:"The file is not allowed ({{ value }} only)."},tpl:{wrap:'<div class="dropify-wrapper"></div>',loader:'<div class="dropify-loader"></div>',message:'<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',preview:'<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',filename:'<p class="dropify-filename"><span class="dropify-filename-inner"></span></p>',clearButton:'<button type="button" class="dropify-clear">{{ remove }}</button>',errorLine:'<p class="dropify-error">{{ error }}</p>',errorsContainer:'<div class="dropify-errors-container"><ul></ul></div>'}};this.element=e,this.input=r(this.element),this.wrapper=null,this.preview=null,this.filenameWrapper=null,this.settings=r.extend(!0,s,t,this.input.data()),this.errorsEvent=r.Event("dropify.errors"),this.isDisabled=!1,this.isInit=!1,this.file={object:null,name:null,size:null,width:null,height:null,type:null},Array.isArray(this.settings.allowedFormats)||(this.settings.allowedFormats=this.settings.allowedFormats.split(" ")),Array.isArray(this.settings.allowedFileExtensions)||(this.settings.allowedFileExtensions=this.settings.allowedFileExtensions.split(" ")),this.onChange=this.onChange.bind(this),this.clearElement=this.clearElement.bind(this),this.onFileReady=this.onFileReady.bind(this),this.translateMessages(),this.createElements(),this.setContainerSize(),this.errorsEvent.errors=[],this.input.on("change",this.onChange)}}return i.prototype.onChange=function(){this.resetPreview(),this.readFile(this.element)},i.prototype.createElements=function(){this.isInit=!0,this.input.wrap(r(this.settings.tpl.wrap)),this.wrapper=this.input.parent();var e=r(this.settings.tpl.message).insertBefore(this.input);r(this.settings.tpl.errorLine).appendTo(e),this.isTouchDevice()===!0&&this.wrapper.addClass("touch-fallback"),this.input.attr("disabled")&&(this.isDisabled=!0,this.wrapper.addClass("disabled")),this.settings.showLoader===!0&&(this.loader=r(this.settings.tpl.loader),this.loader.insertBefore(this.input)),this.preview=r(this.settings.tpl.preview),this.preview.insertAfter(this.input),this.isDisabled===!1&&this.settings.showRemove===!0&&(this.clearButton=r(this.settings.tpl.clearButton),this.clearButton.insertAfter(this.input),this.clearButton.on("click",this.clearElement)),this.filenameWrapper=r(this.settings.tpl.filename),this.filenameWrapper.prependTo(this.preview.find(".dropify-infos-inner")),this.settings.showErrors===!0&&(this.errorsContainer=r(this.settings.tpl.errorsContainer),this.settings.errorsPosition==="outside"?this.errorsContainer.insertAfter(this.wrapper):this.errorsContainer.insertBefore(this.input));var t=this.settings.defaultFile||"";t.trim()!==""&&(this.file.name=this.cleanFilename(t),this.setPreview(this.isImage(),t))},i.prototype.readFile=function(e){if(e.files&&e.files[0]){var t=new FileReader,s=new Image,n=e.files[0],o=null,h=this,l=r.Event("dropify.fileReady");this.clearErrors(),this.showLoader(),this.setFileInformations(n),this.errorsEvent.errors=[],this.checkFileSize(),this.isFileExtensionAllowed(),this.isImage()&&this.file.size<this.sizeToByte(this.settings.maxFileSizePreview)?(this.input.on("dropify.fileReady",this.onFileReady),t.readAsDataURL(n),t.onload=(function(p){o=p.target.result,s.src=p.target.result,s.onload=function(){h.setFileDimensions(this.width,this.height),h.validateImage(),h.input.trigger(l,[!0,o])}}).bind(this)):this.onFileReady(!1)}},i.prototype.onFileReady=function(e,t,s){if(this.input.off("dropify.fileReady",this.onFileReady),this.errorsEvent.errors.length===0)this.setPreview(t,s);else{this.input.trigger(this.errorsEvent,[this]);for(var n=this.errorsEvent.errors.length-1;n>=0;n--){var o=this.errorsEvent.errors[n].namespace,h=o.split(".").pop();this.showError(h)}if(typeof this.errorsContainer<"u"){this.errorsContainer.addClass("visible");var l=this.errorsContainer;setTimeout(function(){l.removeClass("visible")},this.settings.errorTimeout)}this.wrapper.addClass("has-error"),this.resetPreview(),this.clearElement()}},i.prototype.setFileInformations=function(e){this.file.object=e,this.file.name=e.name,this.file.size=e.size,this.file.type=e.type,this.file.width=null,this.file.height=null},i.prototype.setFileDimensions=function(e,t){this.file.width=e,this.file.height=t},i.prototype.setPreview=function(e,t){this.wrapper.removeClass("has-error").addClass("has-preview"),this.filenameWrapper.children(".dropify-filename-inner").html(this.file.name);var s=this.preview.children(".dropify-render");if(this.hideLoader(),e===!0){var n=r("<img />").attr("src",t);this.settings.height&&n.css("max-height",this.settings.height),n.appendTo(s)}else r("<i />").attr("class","dropify-font-file").appendTo(s),r('<span class="dropify-extension" />').html(this.getFileType()).appendTo(s);this.preview.fadeIn()},i.prototype.resetPreview=function(){this.wrapper.removeClass("has-preview");var e=this.preview.children(".dropify-render");e.find(".dropify-extension").remove(),e.find("i").remove(),e.find("img").remove(),this.preview.hide(),this.hideLoader()},i.prototype.cleanFilename=function(e){var t=e.split("\\").pop();return t==e&&(t=e.split("/").pop()),e!==""?t:""},i.prototype.clearElement=function(){if(this.errorsEvent.errors.length===0){var e=r.Event("dropify.beforeClear");this.input.trigger(e,[this]),e.result!==!1&&(this.resetFile(),this.input.val(""),this.resetPreview(),this.input.trigger(r.Event("dropify.afterClear"),[this]))}else this.resetFile(),this.input.val(""),this.resetPreview()},i.prototype.resetFile=function(){this.file.object=null,this.file.name=null,this.file.size=null,this.file.type=null,this.file.width=null,this.file.height=null},i.prototype.setContainerSize=function(){this.settings.height&&this.wrapper.height(this.settings.height)},i.prototype.isTouchDevice=function(){return"ontouchstart"in window||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0},i.prototype.getFileType=function(){return this.file.name.split(".").pop().toLowerCase()},i.prototype.isImage=function(){return this.settings.imgFileExtensions.indexOf(this.getFileType())!="-1"},i.prototype.isFileExtensionAllowed=function(){return this.settings.allowedFileExtensions.indexOf("*")!="-1"||this.settings.allowedFileExtensions.indexOf(this.getFileType())!="-1"?!0:(this.pushError("fileExtension"),!1)},i.prototype.translateMessages=function(){for(var e in this.settings.tpl)for(var t in this.settings.messages)this.settings.tpl[e]=this.settings.tpl[e].replace("{{ "+t+" }}",this.settings.messages[t])},i.prototype.checkFileSize=function(){this.sizeToByte(this.settings.maxFileSize)!==0&&this.file.size>this.sizeToByte(this.settings.maxFileSize)&&this.pushError("fileSize")},i.prototype.sizeToByte=function(e){var t=0;if(e!==0){var s=e.slice(-1).toUpperCase(),n=1024,o=n*1024,h=o*1024;s==="K"?t=parseFloat(e)*n:s==="M"?t=parseFloat(e)*o:s==="G"&&(t=parseFloat(e)*h)}return t},i.prototype.validateImage=function(){this.settings.minWidth!==0&&this.settings.minWidth>=this.file.width&&this.pushError("minWidth"),this.settings.maxWidth!==0&&this.settings.maxWidth<=this.file.width&&this.pushError("maxWidth"),this.settings.minHeight!==0&&this.settings.minHeight>=this.file.height&&this.pushError("minHeight"),this.settings.maxHeight!==0&&this.settings.maxHeight<=this.file.height&&this.pushError("maxHeight"),this.settings.allowedFormats.indexOf(this.getImageFormat())=="-1"&&this.pushError("imageFormat")},i.prototype.getImageFormat=function(){if(this.file.width==this.file.height)return"square";if(this.file.width<this.file.height)return"portrait";if(this.file.width>this.file.height)return"landscape"},i.prototype.pushError=function(e){var t=r.Event("dropify.error."+e);this.errorsEvent.errors.push(t),this.input.trigger(t,[this])},i.prototype.clearErrors=function(){typeof this.errorsContainer<"u"&&this.errorsContainer.children("ul").html("")},i.prototype.showError=function(e){typeof this.errorsContainer<"u"&&this.errorsContainer.children("ul").append("<li>"+this.getError(e)+"</li>")},i.prototype.getError=function(e){var t=this.settings.error[e],s="";return e==="fileSize"?s=this.settings.maxFileSize:e==="minWidth"?s=this.settings.minWidth:e==="maxWidth"?s=this.settings.maxWidth:e==="minHeight"?s=this.settings.minHeight:e==="maxHeight"?s=this.settings.maxHeight:e==="imageFormat"?s=this.settings.allowedFormats.join(", "):e==="fileExtension"&&(s=this.settings.allowedFileExtensions.join(", ")),s!==""?t.replace("{{ value }}",s):t},i.prototype.showLoader=function(){typeof this.loader<"u"&&this.loader.show()},i.prototype.hideLoader=function(){typeof this.loader<"u"&&this.loader.hide()},i.prototype.destroy=function(){this.input.siblings().remove(),this.input.unwrap(),this.isInit=!1},i.prototype.init=function(){this.createElements()},i.prototype.isDropified=function(){return this.isInit},r.fn[a]=function(e){return this.each(function(){r.data(this,a)||r.data(this,a,new i(this,e))}),this},i})})(g);
