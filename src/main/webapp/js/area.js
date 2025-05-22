window.addEventListener('load', drawArea(0));

function refreshPoints(){
    console.info('3');
    const rValue = document.getElementById("main-form:rValue").value;
    drawArea(rValue);
}

function handleSlide(event) {
    const rValue = PF("widget_main_form_rSlider").getValue();
    drawArea(rValue);
}

function onClickFunction() {
    const canvas = document.getElementById("area");
    const rect = canvas.getBoundingClientRect();
    const koef = 125;

    // Координаты клика относительно верхнего левого угла canvas
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Преобразование в координаты относительно центра canvas
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    const relativeX = clickX - canvasCenterX;
    const relativeY = canvasCenterY - clickY; // Y нужно инвертировать, так как у вас ось Y направлена вверх

    try {
        const r = PF("widget_main_form_rSlider").getValue();
        // Преобразование координат с учетом масштаба
        const graphX = (relativeX*r / koef).toFixed(4); // Округление до 2 знаков после запятой
        const graphY = (relativeY*r / koef).toFixed(4);

        sendPoint(graphX.toString(), graphY.toString(), r);
    } catch (e) {
        alert(e.message);
        //заменить на вывод через сообщение
    }
}

function sendPoint(x, y, r) {
    const hiddenX = document.getElementById("hidden-form:hiddenX");
    const hiddenY = document.getElementById("hidden-form:hiddenY");
    const hiddenR = document.getElementById("hidden-form:hiddenR");

    hiddenX.value = x;
    hiddenY.value = y;
    hiddenR.value = r;

    document.getElementById("hidden-form:hiddenSubmitButton").click();
}

function isItHit(x, y, r){
    x = parseFloat(x);
    return ((x >= 0) && (x <= r) && (y >= 0) && (y <= r) || //in rectangle
        (x>=0) && (y >= x/2 - (r/2)) && (y <= 0) || //in triangle
        (x * x + y * y <= r * r ) && (x <= 0) && (y <= 0) //in circle
    );
}

function drawArea(R) {
    let koef = 125
    const canvas = document.getElementById("area");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);

    ctx.fillStyle = "rgb(255,146,51)";
    ctx.strokeStyle = "black";
    ctx.beginPath();

    // Bottom right triangle
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -koef / 2);
    ctx.lineTo(koef, 0);

    // Top right rectangle
    ctx.moveTo(0, 0);
    ctx.lineTo(0, koef);
    ctx.lineTo(koef, koef);
    ctx.lineTo(koef, 0);

    // Bottom left circle
    ctx.arc(0, 0, koef, Math.PI, 3*Math.PI/2, false);
    ctx.closePath();
    ctx.fill();

    // Axis
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(-canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.moveTo(0, -canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2);
    ctx.stroke();

    ctx.fillStyle = "white";



    var table = document.querySelector('#tries');
// получаем все строки таблицы
    var rows = table.querySelectorAll('tr');
    if (rows[1]!==undefined) {
        for (var i = 1; i < rows.length; i++) {
            drawPoint(isItHit(rows[i].cells[1].innerHTML, rows[i].cells[2].innerHTML, R),
                rows[i].cells[1].innerHTML, rows[i].cells[2].innerHTML, R);
        }
    }

    ctx.scale(1, -1);
    ctx.fillStyle = "black";
    ctx.font = "12px monospace";
    if (R===0){
        ctx.fillText("R", koef, -6);
        ctx.fillText("R/2", koef / 2, -6);
        ctx.fillText("-R/2", -koef / 2, -6);
        ctx.fillText("-R", -koef, -6);

        ctx.fillText("R", 6, -koef);
        ctx.fillText("R/2", 6, -koef / 2);
        ctx.fillText("-R/2", 6, koef / 2);
        ctx.fillText("-R", 6, koef);
    }
    else{
        ctx.fillText((R).toString(), koef, -6);
        ctx.fillText((R/2).toString(), koef / 2, -6);
        ctx.fillText((-R/2).toString(), -koef / 2, -6);
        ctx.fillText((-R).toString(), -koef, -6);

        ctx.fillText((R).toString(), 6, -koef);
        ctx.fillText((R/2).toString(), 6, -koef / 2);
        ctx.fillText((-R/2).toString(), 6, koef / 2);
        ctx.fillText((-R).toString(), 6, koef);
    }

    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    return null;
}

function drawPoint(isHit, x, y, r){
    const context = document.getElementById("area").getContext("2d");
    if (r ===0 || x==='undefined' || x==='null' || x===''){
        return;
    }
    let SCALE_FACTOR = 125/r;
    context.beginPath();
    context.arc(x * SCALE_FACTOR, y * SCALE_FACTOR, 5, 0, Math.PI * 2);
    if (isHit==='true' || isHit==='YES' || isHit===true){
        context.fillStyle = "rgb(78,255,51)";
    }
    else if (isHit==='false' || isHit==='NO' || isHit===false){
        context.fillStyle = "rgb(255,51,51)";
    }
    context.fill();
}


