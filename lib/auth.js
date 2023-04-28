module.exports = {
    is_owener : function (request,response){
        if(request.user){
            return true;
        } else {
            return false;
        }
    },
    statusUI : function (request,response){
        let authStatusUI = `<a href="/auth/login">login</a>`;
        if(this.is_owener(request,response)){
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}