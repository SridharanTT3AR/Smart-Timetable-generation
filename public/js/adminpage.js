$(document).ready(function()  {
      $(".sub-functions,.home").click(function(){
        // event.preventDefault()
        var path=event.target.id;
        $.ajax({
                type: 'GET',
                url: path,
                success: function(data) {
                      $('.content').html(data);
                          }
               });
      });
      $(".homedel").click(function(){
        if(confirm("All Allocation will be deleted!"))
        {
            var path=event.target.id;
            $.ajax({
                    type: 'GET',
                    url: path,
                    success: function(data) {
                          $('.content').html(data);
                              }
                   });
        }
      });
      var i=0;
      $(".replacement").click(function(){
         event.preventDefault();
         i=$("#replaceID")[0].value;
         var path="/replacement/"+$("#replaceID")[0].value ;
         $.ajax({
                 type: 'GET',
                 url: path,
                 success: function(data) {
                       alert("Replacement Calucated")
                           }
                });
      });

      $(".viewreplacement").click(function(){
         var path="/sendreplacementID/"+i;
         $.ajax({
                 type: 'GET',
                 url: path,
                 success: function(data) {
                       $('.content').html(data);
                           }
                });
      });

      $(".deletereplacement").click(function(){
         var path="/deletereplacement";
         $.ajax({
                 type: 'GET',
                 url: path,
                 success: function(data) {
                      alert(data);
                           }
                });
      });
});

    function updateForm(val){
        var elem1 = document.getElementById("electiveID");
        var elem2 = document.getElementById("projector");
        var elem3 = document.getElementById("labIncharge");

        if (val == 'Elective' ){
            elem1.style.display = "block";
        }else if(val == 'Classroom'){
            elem2.style.display = "block";
            elem3.style.display = "none";
        }else if(val == 'Lab'){
            elem3.style.display = "block";
            elem2.style.display = "none";
        }
        else{
            elem1.style.display = "none";

        }
    }
