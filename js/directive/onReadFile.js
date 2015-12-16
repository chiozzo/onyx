/**
 * This directive is a copy pasta job and I'm not entirely sure how it works yet. I added $state.go for my purposes.
 * http://stackoverflow.com/questions/25652959/angular-file-upload-without-local-server
 */
app.directive('onReadFile', ['$parse', '$state', function($parse, $state){
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attrs) {

        var fn = $parse(attrs.onReadFile);
        ele.on('change', function(onChangeEvent){
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function(){
              fn(scope, {$fileContents: onLoadEvent.target.result} );
            });
            // $state.go('universeList');
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });

      }
    };
  }
]);