document.addEventListener('DOMContentLoaded', function(){
    InitViewport();
})

function InitViewport() {
    const minwidth = 320;
    SetViewport(minwidth);
    window.addEventListener('resize', function(event){
        SetViewport(minwidth);
    });
}

function SetViewport(minwidth) {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (screen.width < minwidth) {
        viewport.content = 'user-scalable=no,width=' + minwidth;
    } else {
        viewport.content = 'width=device-width,initial-scale=1';
    }
}
