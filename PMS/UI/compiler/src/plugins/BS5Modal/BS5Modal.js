/**
  * BS5ModalJS - A JavaScript class for creating
  * Bootstrap 5 Modals in your document.
  *
  * This removes the hassle of writing the Bootstrap 5
  * HTML elements manually in your document. This class
  * will create those elements for you automatically.
  *
  * @author Eleazer Jr. Ababa
  * @contact eleazer@ababagaming.com
  * 
  * @prerequisite
  * The main bootstrap 5 framework must be referred by
  * your document.
  * @link https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css
  * 
  * You may also include the javascript library of
  * bootstrap 5 if you prefer using javascript to
  * toggle the modals
  * @link https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js
  *
  * @author Prashik : Axpert Popup Changes : 2022
*/


/**
  * @class {class} BSModal
  * this is the main class of BS5Modal
*/
class BSModal { 
    /**
      * @constructs
      * The constructor takes care of creating the
      * nodes/elements and automatically prepends to
      * your document's <body>
      *
      * @param {string} id              unique identifier of the modal
      * @param {string} title           this will be the header of the modal
      * @param {string} html         the main html of the modal accepts html values
      * @param {function} shownCallBack      a function that will be called when the modal will be completely shown
      * @param {function} hideCallback      a function that will be called when the modal will start to hide
      * 
    */
    constructor(id, title, html, shownCallBack = ()=>{}, hideCallback = ()=>{}) {
        
        //the main container of the element (parent)
        let pElem = document.createElement("div");
        pElem.classList.add("modal");
        pElem.classList.add("fade");
        pElem.setAttribute("id", id);
        pElem.setAttribute("tabindex", "-1");
        pElem.setAttribute("aria-labelledby", id + "Label");
        pElem.setAttribute("aria-hidden", "true");

        pElem.addEventListener("shown.bs.modal", (e)=>{shownCallBack && shownCallBack(e, this)});

        pElem.addEventListener("hide.bs.modal", (e)=>{hideCallback && hideCallback(e, this)});

        pElem.addEventListener("hidden.bs.modal", (e)=>{pElem.remove(e, this)});

        pElem.addEventListener("close", (e)=>{this.close(e, this)});
                    
        //modal dialog
        let mDialog = document.createElement("div");
        mDialog.classList.add("modal-dialog");
                    
        //modal content
        let mContent = document.createElement("div");
        mContent.classList.add("modal-content");
                    
        //modal header
        let mHeader = document.createElement("div");
        mHeader.classList.add("modal-header");
                    
        //modal title
        let mTitle = document.createElement("h5");
        mTitle.classList.add("modal-title");
        mTitle.setAttribute("id", id + "Label");
        mTitle.innerText = title;
                    
        //modal close button
        let mCloseBtn = document.createElement("button");
        mCloseBtn.classList.add("btn-close");
        mCloseBtn.setAttribute("type","button");
        mCloseBtn.setAttribute("data-bs-dismiss", "modal");
        mCloseBtn.setAttribute("aria-label", "Close");
                  
        //modal floating close button
        let mFloatingCloseBtn = document.createElement("button");
        mFloatingCloseBtn.classList.add(...["d-none", "btn", "btn-icon", "btn-white", "btn-color-gray-500", "btn-active-primary", "btn-close---", "rounded-circle---", "position-absolute", "top-0", "end-0", "shadow-sm"]);
        mFloatingCloseBtn.setAttribute("type","button");
        mFloatingCloseBtn.setAttribute("data-bs-dismiss", "modal");
        mFloatingCloseBtn.setAttribute("aria-label", "Close");
        mFloatingCloseBtn.innerHTML = `
        <span class="material-icons material-icons-style">
            close
        </span>
        `;

        //modal body
        let mBody = document.createElement("div");
        mBody.classList.add("modal-body");
        mBody.innerHTML = html;
        mBody.appendChild(mFloatingCloseBtn);
                    
        //modal footer
        let mFooter = document.createElement("div");
        mFooter.classList.add("modal-footer");
                    
        //modal cancel button
        let mCancelBtn = document.createElement("button");
        mCancelBtn.classList.add("btn");
        mCancelBtn.classList.add("btn-light");
        mCancelBtn.setAttribute("type", "button");
        mCancelBtn.setAttribute("data-bs-dismiss", "modal");
        mCancelBtn.classList.add("modal-cancel");
        mCancelBtn.innerText = "Cancel";
                    
        //modal confirm button
        let mConfirmBtn = document.createElement("button");
        mConfirmBtn.classList.add("btn");
        mConfirmBtn.classList.add("btn-primary");
        mConfirmBtn.setAttribute("type", "button");
        mConfirmBtn.setAttribute("data-bs-dismiss", "modal");
        mConfirmBtn.classList.add("modal-ok");
        mConfirmBtn.innerText = "Ok";
           
        //ASSEMBLE THE ELEMENTS
        //append the footer buttons to the footer
        mFooter.appendChild(mCancelBtn);
        mFooter.appendChild(mConfirmBtn);
                    
        //append the title and the close button to the header
        mHeader.appendChild(mTitle);
        mHeader.appendChild(mCloseBtn);
                    
        //append the header, body and footer to modal content
        mContent.appendChild(mHeader);
        mContent.appendChild(mBody);
        mContent.appendChild(mFooter);
                    
        //append the modal content to the modal dialog
        mDialog.appendChild(mContent);
                    
        //append the dialog to the parent element
        pElem.appendChild(mDialog);
                    
        //finally prepend the modal element (pElem) to the document's body
        document.body.prepend(pElem);
        
        this.modalContent = mContent;
        this.modalHeader = mHeader;
        this.modalBody = mBody;
        this.modalFooter = mFooter;
        this.floatingCloseButton = mFloatingCloseBtn;

        /**
          * @prop {node} modalElement
          * this property is a reference to the
          * modal's element
        */
        this.modalElement = pElem;
    

        /**
          * @prop {string} elementId
          * this property stores the element's
          * id attribute value
        */
        this.elementId = id;
        
        /**
          * @prop {string} elementTitle
          * this property stores the element's
          * title
        */
        this.elementTitle = title;
        
        /**
          * @prop {string} elementHtml
          * this property stores the element's
          * body html
        */
        this.elementHtml = html;
        
        /**
          * @prop {node} modalDialog
          * a reference to the modal
          * dialog element
        */
        this.modalDialog = mDialog;
        
        /** @prop {node} cancelBtn
          * a reference to the modal's cancel button element
          * change the innerText property of this element
          * if you want to change the cancel button's text
        */
        this.cancelBtn = mCancelBtn;
        
        /** @prop {node} okBtn
          * a reference to the modal's confirm button element
          * change the innerText property of this element
          * if you want to change the confirm button's text
        */
        this.okBtn = mConfirmBtn;        
        
        this.modal = new bootstrap.Modal(this.modalElement);

        this.modal.show();
    }
    
    
    /**
      * @method toggleButton
      * Create and returns a bootstrap 5 button that toggles
      * the modal when you click it
      *
      * @param {string} innerText       the innerText propery of the button
      *                                 default is "Submit"
      * @param {string} classes         specifies the class name of the button
      *                                 if multiple, should be separated by spaces
      *                                 use this parameter to design the button
      *                                 default is "btn btn-outline-primary"
      *
      * @return {node} button           the generated button element
    */
    
    toggleButton(innerText = "Submit", classes = "btn btn-outline-primary") {
        
        let button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#" + this.elementId);
        button.className = classes;
        button.innerText = innerText;
        
        return button;
        
    }
    
    /**
      * @method staticBackdrop
      * Call this method to set the modal's backdrop to static
      * This means that clicking outside the modal
      * will not dismiss the modal
    */
    
    staticBackdrop()
    {
        this.modalElement.setAttribute("data-bs-backdrop", "static");
        this.modalElement.setAttribute("data-bs-keyboard", "false");
        this.modal._config.backdrop = "static";
        this.modal._config.keyboard = false;
    }
    
    /**
      * @method scrollableDialog
      * Call this method to turn the modal's dialog into a scrollable
      * dialog. This means that the header and footer will not
      * scroll with the modal's content
    */
    scrollableDialog()
    {
        this.modalDialog.classList.add("modal-dialog-scrollable");
    }
    
    /**
      * @method verticallyCentered
      * Call this method to center the modal vertically
    */
    verticallyCentered()
    {
        this.modalDialog.classList.add("modal-dialog-centered");
    }
    
    /**
      * @method changeSize
      * Change the size of the modal
      * @param {string} size        size (xl, lg, sm)
      * xl -> extra large 1140px
      * lg -> large 800px
      * sm -> small 300px
    */
    changeSize(size)
    {
        this.modalDialog.classList.add("modal-" + size);
    }
    
    /**
      * @method removeAnimation
      * Call this method to remove the animation of the modal
      * Modal will simply appear instead of fade to view
    */
    removeAnimation()
    {
        this.modalElement.classList.remove("fade");
    }

    hideHeader()
    {
        this.modalHeader.classList.add("d-none");
    }

    hideFooter()
    {
        this.modalFooter.classList.add("d-none");
    }

    showFloatingClose(){
        this.floatingCloseButton.classList.remove("d-none");
    }

    close(){
        this.modal.hide();
    }
}