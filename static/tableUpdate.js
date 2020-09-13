function startUpdate() {
  myVar = setInterval(tableUpdate, 5000);
  tableUpdate();
}

function convertPriceToFloat(price)
{
  var floatPrice = parseFloat(price.substring(1,price.length).replace(new RegExp(',', 'g'), ''));
  return floatPrice;
}

function getColor(current, updated, color)
{
   if ( parseFloat(current.toFixed(2)) > parseFloat(updated.toFixed(2)))
    return "#FC8A65";
   else if ( parseFloat(current.toFixed(2)) < parseFloat(updated.toFixed(2)))
    return "#92F15F";

  return color;
}

function tableUpdate()
{
   var table = document.getElementById("symboltable");
     
		$.ajax(
    {
			  url: '/symbolsPrice',
			  type: 'GET',
			  success:function(response)
        {
          var updatedTotal = 0;
				  console.log(response);
          var r = JSON.parse(response);
          for (var i = 1, row; i < table.rows.length-2; i++)
          {
            row = table.rows[i];
            symbol = row.cells[0].innerHTML;
            currentPriceString= row.cells[3].innerHTML;
            currentPrice = convertPriceToFloat(currentPriceString);
            updatedPrice = convertPriceToFloat(r[symbol]);
            row.cells[3].innerHTML = r[symbol];
            row.cells[3].bgColor = getColor(currentPrice,updatedPrice, row.cells[3].bgColor);

            shares = parseInt(row.cells[2].innerHTML);
            var updatedValue = updatedPrice*shares;
            var currentValue = convertPriceToFloat(row.cells[4].innerHTML);
            row.cells[4].innerHTML = "$" + parseFloat(updatedValue.toFixed(2)).toLocaleString("en-US");
            row.cells[4].bgColor = getColor(currentValue, updatedValue, row.cells[4].bgColor);
          
            updatedTotal = updatedTotal + updatedValue;
          }

          var actualTotal = updatedTotal + convertPriceToFloat(document.getElementById("cash").innerHTML);
          document.getElementById("total").innerHTML = "$" + parseFloat(actualTotal.toFixed(2)).toLocaleString("en-US");

          if ( actualTotal > 10000 )
            document.getElementById("total").bgColor = "#92F15F";
          else if ( actualTotal < 10000 )
            document.getElementById("total").bgColor = "#FC8A65";
          else
            document.getElementById("total").bgColor = "#FAF393";
			  },
			  error: function(error)
        {
				  console.log(error);
			  }
    });
}

