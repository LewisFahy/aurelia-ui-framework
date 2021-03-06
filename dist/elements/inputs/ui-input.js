var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', "../../utils/ui-event"], function (require, exports, aurelia_framework_1, ui_event_1) {
    "use strict";
    var UIBaseInput = (function () {
        function UIBaseInput() {
            this.value = '';
            this.disabled = false;
            this.readonly = false;
            this.isDisabled = false;
        }
        UIBaseInput.prototype.bind = function (bindingContext, overrideContext) {
            var _this = this;
            this.element['focus'] = function () { return _this.focus(); };
            this.disabledChanged(this.disabled);
            this.readonlyChanged(this.readonly);
        };
        UIBaseInput.prototype.disabledChanged = function (newValue) {
            this.element.classList[(this.isDisabled = this.disabled = isTrue(newValue)) ? 'add' : 'remove']('ui-disabled');
        };
        UIBaseInput.prototype.readonlyChanged = function (newValue) {
            this.element.classList[(this.readonly = isTrue(newValue)) ? 'add' : 'remove']('ui-readonly');
        };
        UIBaseInput.prototype.disable = function (b) {
            this.element.classList[(this.isDisabled = (b || this.disabled)) ? 'add' : 'remove']('ui-disabled');
        };
        UIBaseInput.prototype.clearInput = function () {
            this.value = '';
            this.inputEl.focus();
            ui_event_1.UIEvent.fireEvent('input', this.element, this.value);
            ui_event_1.UIEvent.fireEvent('change', this.element, this.value);
        };
        UIBaseInput.prototype.focus = function () {
            this.inputEl.focus();
        };
        UIBaseInput.prototype.fireEvent = function (evt) {
            evt.stopPropagation();
            var el = getParentByClass(this.element, 'ui-input-group');
            if (evt.type === 'focus') {
                this.inputEl.select();
                this.element.classList.add('ui-focus');
                if (el)
                    el.classList.add('ui-focus');
            }
            if (evt.type === 'blur') {
                this.element.classList.remove('ui-focus');
                if (el)
                    el.classList.remove('ui-focus');
            }
            ui_event_1.UIEvent.fireEvent(evt.type, this.element, this.value);
        };
        return UIBaseInput;
    }());
    exports.UIBaseInput = UIBaseInput;
    var UIInput = (function (_super) {
        __extends(UIInput, _super);
        function UIInput(element) {
            _super.call(this);
            this.element = element;
            this.value = '';
            this.dir = '';
            this.width = 'auto';
            this.errors = null;
            this.maxlength = 99;
            this.disabled = false;
            this.readonly = false;
            this.info = '';
            this.placeholder = '';
            this.type = 'text';
            this.clear = false;
            this.counter = false;
            this.ignore = false;
            this.clear = element.hasAttribute('clear');
            this.counter = element.hasAttribute('counter');
            if (element.hasAttribute('url'))
                this.type = 'url';
            if (element.hasAttribute('file'))
                this.type = 'file';
            if (element.hasAttribute('email'))
                this.type = 'email';
            if (element.hasAttribute('number') || element.hasAttribute('number.bind'))
                this.type = 'number';
            if (element.hasAttribute('decimal') || element.hasAttribute('decimal.bind'))
                this.type = 'number';
            if (element.hasAttribute('password'))
                this.type = 'password';
        }
        UIInput.prototype.created = function (owningView, myView) { };
        UIInput.prototype.bind = function (bindingContext, overrideContext) {
            _super.prototype.bind.apply(this, arguments);
            if (this.number)
                this.numberChanged(this.number);
            if (this.decimal)
                this.decimalChanged(this.decimal);
        };
        UIInput.prototype.attached = function () { };
        UIInput.prototype.detached = function () { };
        UIInput.prototype.unbind = function () { };
        UIInput.prototype.valueChanged = function (newValue) {
            var _this = this;
            if (this.ignore)
                return;
            this.ignore = true;
            this.number = isNaN(parseFloat(newValue)) ? null : parseFloat(newValue);
            this.decimal = isNaN(parseFloat(newValue)) ? null : parseFloat(newValue);
            if (this.type === 'number' && this.number === null)
                this.inputEl.value = this.value = '';
            setTimeout(function () { return _this.ignore = false; }, 100);
        };
        UIInput.prototype.numberChanged = function (newValue) {
            var _this = this;
            if (this.ignore)
                return;
            this.ignore = true;
            this.value = newValue || '';
            setTimeout(function () { return _this.ignore = false; }, 100);
        };
        UIInput.prototype.decimalChanged = function (newValue) {
            var _this = this;
            if (this.ignore)
                return;
            this.ignore = true;
            this.value = newValue || '';
            setTimeout(function () { return _this.ignore = false; }, 100);
        };
        UIInput.prototype.fireEvent = function (evt) {
            if (evt.type === 'input') {
                if (this.type === 'email' || this.type === 'url')
                    this.value = this.value.toLowerCase();
            }
            _super.prototype.fireEvent.call(this, evt);
        };
        UIInput.prototype.checkInput = function (evt) {
            evt.stopPropagation();
            var code = evt.keyCode || evt.which;
            if (evt.ctrlKey || evt.metaKey || evt.altKey || code == 9 || code == 8)
                return true;
            if (code == 13)
                return ui_event_1.UIEvent.fireEvent('enterpressed', this.element);
            if (this.type == 'email')
                return /[a-zA-Z0-9\@\-\.\_\&\+\$]/.test(String.fromCharCode(code));
            if (this.type == 'url')
                return /[a-zA-Z0-9\/\-\.\_\?\#\%\=\$\;\:\{\[\]\}\&\+]/.test(String.fromCharCode(code));
            if (this.type == 'number') {
                if (code == 45 && evt.target.value.indexOf('-') >= 0)
                    return false;
                if (code == 46 && evt.target.value.indexOf('.') >= 0)
                    return false;
                return /[0-9\.\-]/.test(String.fromCharCode(code));
            }
            return true;
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "number", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "decimal", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "dir", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "width", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "errors", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "maxlength", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "disabled", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "readonly", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "info", void 0);
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIInput.prototype, "placeholder", void 0);
        UIInput = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.inlineView("<template class=\"ui-input-wrapper\" css.bind=\"{width: width}\"><div role=\"input\" class=\"ui-input-control\"><slot></slot>\n  <span class=\"ui-error\" if.bind=\"errors\"><ui-glyph glyph=\"ui-invalid\"></ui-glyph><ul class=\"ui-error-list\"><li repeat.for=\"err of errors\" innerhtml.bind=\"err\"></li></ul></span>\n  <input ref=\"inputEl\" type.bind=\"type\" value.bind=\"value\" maxlength.bind=\"maxlength\" dir.bind=\"dir\"\n    focus.trigger=\"fireEvent($event)\" blur.trigger=\"fireEvent($event)\"\n    input.trigger=\"fireEvent($event)\" change.trigger=\"fireEvent($event)\"\n    keypress.trigger=\"checkInput($event)\" placeholder.bind=\"placeholder\"\n    disabled.bind=\"isDisabled\" readonly.bind=\"readonly\"/>\n  <span class=\"ui-clear\" if.bind=\"clear && value\" click.trigger=\"clearInput()\">&times;</span>\n  <span class=\"ui-counter\" if.bind=\"counter\" innerhtml.bind=\"maxlength - value.length\"></span></div>\n  <div class=\"ui-input-info\" if.bind=\"info\" innerhtml.bind=\"info\"></div>\n</template>"),
            aurelia_framework_1.customElement('ui-input'), 
            __metadata('design:paramtypes', [Element])
        ], UIInput);
        return UIInput;
    }(UIBaseInput));
    exports.UIInput = UIInput;
    var UIFileInput = (function () {
        function UIFileInput(element) {
            this.element = element;
            this.fileTypes = '';
            this.files = [];
            this.dragging = false;
        }
        UIFileInput.prototype.created = function (owningView, myView) { };
        UIFileInput.prototype.bind = function (bindingContext, overrideContext) { };
        UIFileInput.prototype.attached = function () {
            this.inputEl.draggedFiles = this.files;
        };
        UIFileInput.prototype.detached = function () { };
        UIFileInput.prototype.unbind = function () { };
        UIFileInput.prototype.dragEnter = function ($event) {
            this.dragging = true;
            $event.preventDefault();
            return false;
        };
        UIFileInput.prototype.dragExit = function ($event) {
            this.dragging = false;
        };
        UIFileInput.prototype.drop = function ($event) {
            this.dragging = false;
            $event.preventDefault();
            var dt = $event.dataTransfer;
            var files = dt.files;
            for (var i = 0; i < files.length; i++) {
                var f = { file: files[i], name: files[i].name, size: files[i].size || 0, ext: window.FileTypes[files[i].type] || 'txt' };
                this.files.push(f);
            }
        };
        UIFileInput.prototype.fileChoose = function () {
            var files = this.inputEl.files;
            for (var i = 0; i < files.length; i++) {
                var f = { file: files[i], name: files[i].name, size: files[i].size || 0, ext: window.FileTypes[files[i].type] || 'txt' };
                this.files.push(f);
            }
        };
        UIFileInput.prototype.remove = function (index) {
            this.files.splice(index, 1);
        };
        UIFileInput.FILE_IMAGES = 'png,jpg,jpeg,tiff';
        UIFileInput.FILE_DOCS = 'doc,docx,xls,xlsx,ppt,pptx,csv,rtf,txt,pdf';
        __decorate([
            aurelia_framework_1.bindable(), 
            __metadata('design:type', Object)
        ], UIFileInput.prototype, "fileTypes", void 0);
        UIFileInput = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.inlineView("<template class=\"ui-input-wrapper ui-file-input\">\n  <div class=\"ui-control-wrapper\">\n    <div class=\"ui-file-drop-zone ${dragging?'dragging':''}\" ref=\"dropZone\" click.trigger=\"inputEl.click()\" \n      dragover.trigger=\"dragEnter($event)\" dragleave.trigger=\"dragExit($event)\" drop.trigger=\"drop($event)\">\n    <span><i class=\"fi-ui-upload-white\"></i> Drop files here<br/>or<br/>click to browse</span>\n    </div>\n    <input type=\"file\" ref=\"inputEl\" class=\"ui-file-input-el\" change.trigger=\"fileChoose()\" />\n    <div class=\"ui-file-list\">\n      <p repeat.for=\"file of files\" class=\"ui-row ui-row-middle\">\n      <a click.trigger=\"remove($index)\"><ui-glyph glyph=\"ui-dialog-close\" class=\"ui-text-danger\"></ui-glyph></a>\n      <span class=\"ui-col-fill\">${file.name}<br/>(<small innerhtml.bind=\"file.size | number:'0.00b'\"></small>)</span></p>\n    </div>\n  </div>\n</template>"),
            aurelia_framework_1.customElement('ui-file'), 
            __metadata('design:paramtypes', [Element])
        ], UIFileInput);
        return UIFileInput;
    }());
    exports.UIFileInput = UIFileInput;
});
