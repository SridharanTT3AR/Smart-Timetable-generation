$(document).ready(function()  {
      $(".delete").click(function(){
        if(confirm("Item will be deleted!"))
        {
            console.log("deleted");
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
    });
