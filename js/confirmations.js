$(function() {
    $(document).ready(function() {
        $.getJSON("php/checksession.php", function(data){
            if(!data){
                window.location = "/officehourscheduler/index.html";
            }
        });

        $.getJSON( "php/getscheduledslots.php", function( data ) {
            var str = "";
            for(var i=0;i<data.length;i++){
                console.log(i);
                str += "<tr><td>"
                str+=(i+1)+"</td>"
                str+="<td>" + data[i]['course'] + "</td>";
                str+="<td>" + data[i]['querytitle'] + "</td>";
                str+="<td>" + data[i]['querydescription'] + "</td>";
                str+="<td>" + data[i]['bookingdate'] + " and "+ data[i]['timeslot'] +"</td>";
                str+="<td>" + data[i]['assignedto'] + "</td>";
                str+='<td><a href="#" onclick="editconfirmation(\''+data[i]['course']+"','"+ data[i]['querytitle'] +"','"+ data[i]['querydescription']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Edit</a></td>";
                str+='<td><a href="#" onclick="deleteconfirmation(\''+data[i]['course']+"','"+ data[i]['requestedby']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Delete</a></td>";
                str+="</tr>";
            }
            console.log(str);
            $(".confirmations-table").append(str); 

        });
      });
    
});
var globalQueryData = "";
function editconfirmation(course, queryTitle, queryDescription, bookingdate, timeslot){
    $("#createEventModal").modal('show');
    $('#queryTitle').val(queryTitle);
    $('#queryDescription').val(queryDescription);
    var querydata = {
        "course": course,
        "bookingdate": bookingdate,
        "timeslot": timeslot,
        "querytitle": queryTitle,
        "queryDescription": queryDescription,
    };
    globalQueryData = querydata;
}

function deleteconfirmation(course, requestedby, bookingdate, timeslot){
    //Ajax call to delete make a php file
    var querydata = {
        "course": course,
        "requestedby": requestedby,
        "bookingdate": bookingdate,
        "timeslot": timeslot
    };
    $.post( "php/deletebooking.php", querydata,function(data) {
        if(data.trim()=="success"){
            $("#createEventModal").modal('hide');
            window.location = "/officehourscheduler/myconfirmations.html";
          }else{
            alert("Some error occured. Try Again later");
          }
    });
    
}

$('#submitButton').on('click', function(e){
    e.preventDefault();
    $("#createEventModal").modal('hide');
    var newQueryTitle = $('#queryTitle').val();
    var newQueryDesc = $('#queryDescription').val();
    if(newQueryDesc.trim()=="" || newQueryTitle.trim()==""){
        alert("Query Title or Description can't be empty");
    }else{
        console.log(globalQueryData);
        globalQueryData["querytitle"] = newQueryTitle;
        globalQueryData["queryDescription"] = newQueryDesc;
        $.post( "php/editbooking.php", globalQueryData,function(data) {
            if(data.trim()=="success"){
                $("#createEventModal").modal('hide');
                window.location = "/officehourscheduler/myconfirmations.html";
            }else{
                alert("Some error occured. Try Again later");
            }
        });
    }

});