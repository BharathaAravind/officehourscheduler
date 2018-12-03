$(function() {
    $(document).ready(function() { 
        
        $.getJSON("php/checksession.php", function(data){
            if(!data){
                window.location = "/officehourscheduler/duo.php";
            }
        });

        $.getJSON( "php/getsconfirmedbookings.php", function( data ) {
            var str = "";
            for(var i=0;i<data.length;i++){
                console.log(i);
                str += "<tr><td>"
                str+=(i+1)+"</td>"
                str+="<td>" + data[i]['course'] + "</td>";
                str+="<td>" + data[i]['querytitle'] + "</td>";
                str+="<td>" + data[i]['querydescription'] + "</td>";
                str+="<td>" + data[i]['bookingdate'] + " and "+ data[i]['timeslot'] +"</td>";
                str+="<td>" + data[i]['requestedby'] + "</td>";
                str+="</tr>";
            }
            console.log(str);
            $(".confirmations-table").append(str); 

        });
      });
    
});
