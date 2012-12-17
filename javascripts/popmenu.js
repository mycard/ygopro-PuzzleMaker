function ContextMenu(){
    this.menu       = document.createElement("div");
    this.menuBody   = document.createElement("ul");
    this.addItem    = function(itemText,styleImg,ev){
        var subItem = document.createElement("li");
        var menu    = this.menu;
        subItem.innerHTML   = itemText;
        with(subItem.style){
            className       = "ContextMenuSubItem";
            fontSize        = "12px";
            height          = "16px";
            paddingLeft     = "22px";
            margin          = "2px";
            background      = "url(" + styleImg + ") no-repeat #cde6c7";
            opacity         = "0.7";
            cursor          = "default";
        }
        subItem.onmouseover = function(){
            with(subItem.style){
                opacity       = "1";
                cursor        = "default";
                background    = "url(" + styleImg + ") no-repeat #abc88b";
            }
        }
        subItem.onmouseout  = function(){
            subItem.style.opacity       = "0.7";
            subItem.style.cursor        = "default";
            subItem.style.background    = "url(" + styleImg + ") no-repeat #cde6c7";
        };
        subItem.onclick = function(){
            subItem.style.cursor  = "default";
            menu.style.display = "none";
            ev();
            return false;
        };
        this.menuBody.appendChild(subItem);
    };
    /**
     * addMenuTo方法将该右键菜单应用到指定的元素。一个参数。
     * obj : 应用该右键菜单的元素
     */
    this.addMenuTo  = function(obj){
        /*设置ul的样式*/
        with(this.menuBody.style){
            className           = "myContextMenuBody";
            listStyle           = "none";
            listStylePosition   = "inside";
            margin              = "0px";
            padding             = "0px";
        };
        /*设置div的样式*/
        with(this.menu.style){
            className   = "myContextMenu";
            position    = "absolute";
            display     = "none"
            background  = "#cde6c7";
            width       = "110px";
            zindex      = "9000";
            border      = "1px solid #1d953f"
        };
        
        this.menu.appendChild(this.menuBody);
        document.body.appendChild(this.menu);
        /*由于在事件函数内，this指代的对象不再是本类的对象，
         * 所以为以下函数定义一个全局变量menu
         */
        var menu = this.menu;
        obj.onblur = function(){
            menu.style.display = "none";
        }
        obj.oncontextmenu = function(ev){
            menu.style.top     = ev.pageY;
            menu.style.left    = ev.pageX;
            menu.style.display = "block";
            return false;
        }
    }
	
}