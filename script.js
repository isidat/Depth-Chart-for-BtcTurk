(function() {
    'use strict';

    $("#advanceTradeForm").append("<div class=\"layout\" style=\"position: relative;bottom:0;left: -350px;z-index: 10;\">    <canvas id=\"depth\" width=\"600\" height=\"300\" style=\"position:absolute;\"></canvas>    <canvas id=\"x\" width=\"600\" height=\"24\" style=\"position:absolute; top:300px; left:0;\"></canvas>    <canvas id=\"y\" width=\"48\" height=\"300\" style=\"position:absolute; top:0px; left:600px;\"></canvas>    </div>");

    function drawDepthChart() {
        var buyArray = [];

        $(".dephTableBuyTable tr.orderRow").each(function(i, val) {
            buyArray.push({ "price": parseFloat($(val).attr("price").replace(",", "")), "amount": parseFloat($(val).attr("amount").replace(",", "")), "total": 0 });
        });

        var sellArray = [];

        $(".dephTableSellTable tr.orderRow").each(function(i, val) {
            sellArray.push({ "price": parseFloat($(val).attr("price").replace(",", "")), "amount": parseFloat($(val).attr("amount").replace(",", "")), "total": 0 });
        });

        var data = {
            "sell":	sellArray,
            "buy": buyArray
        };

        for(var i=0; i<30; i++){
            var total = 0;
            for(var n=0; n <= i; n++){
                total += data['buy'][n]['amount'];
            }

            data['buy'][i]['total'] = total;
        }

        for(var i=0; i<30; i++){
            var total = 0;
            for(var n=0; n <= i; n++){
                total += data['sell'][n]['amount'];
            }

            data['sell'][i]['total'] = total;
        }


        var gap = 10;
        var canvas=document.getElementById('depth');
        var width = canvas.getAttribute('width');
        var height = canvas.getAttribute('height');

        var maxAmount = Math.max( data['sell'][0]['total'],  data['buy'][30-1]['total']);

        var scaleH = maxAmount / height;

        var scaleW = width / 2 / 30;

        var context=canvas.getContext('2d');

        context.beginPath();
        context.fillStyle = '#70a800';
        var x = 0;
        var y  = 0;
        context.moveTo(width/2-gap, height);

        for(var i=0; i<30; i++){
            x = width/2 - i * scaleW-gap;
            y = height - data['buy'][i]['total']/maxAmount*height;
            context.lineTo(x, y);
        }

        context.lineTo(0, y);
        context.lineTo(0, height);
        context.lineTo(width/2-gap, height);
        context.fill();
        context.closePath();

        context.beginPath();
        context.fillStyle = '#ea0070';
        context.moveTo(width/2+gap, height);
        for(var i=0; i<30; i++){
            x = width/2 + i * scaleW + gap;
            y = height - data['sell'][i]['total']/maxAmount * height;
            context.lineTo(x,y);
        }

        context.lineTo(width+gap, y);
        context.lineTo(width+gap, height);
        context.lineTo(width/2+gap, height);
        context.fill();
        context.closePath();

        var canvasX = document.getElementById('x');
        var contextX = canvasX.getContext('2d');
        contextX.clearRect(0, 0, canvasX.width, canvasX.height);

        var canvasY = document.getElementById('y');
        var contextY = canvasY.getContext('2d');
        contextY.clearRect(0, 0, canvasY.width, canvasY.height);

        contextX.fillStyle = '#444';
        contextY.fillStyle = '#444';

        for(var i=0; i<30; i++){
            if(i%3) continue;
            x = width/2 - i * scaleW-30;
            y = 12;
            contextX.fillText(data['buy'][i]['price'], x, y);
        }

        for(var i=0; i<30; i++){
            if(i%3) continue;
            x = width/2 + i * scaleW;
            y = 12;
            contextX.fillText(data['sell'][i]['price'], x, y);
        }

        var seg = maxAmount/10;
        for(var i=1; i<11; i++){
            x = 12;
            y = height - seg*i/maxAmount * height;
            contextY.fillText(seg*i > 1000 ? (parseInt(seg*i/1000)+'K'): seg*i, x, y);
        }
    }

    setInterval(function(){ drawDepthChart(); }, 1000);
})();
