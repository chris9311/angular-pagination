var app = angular.module('app',['ngRoute']);

app.config(['$routeProvider',function($routeProvider){
    //console.log("init");
    $routeProvider
        .when('/index/:page',{
            templateUrl : 'pagination.html'
        })
        .otherwise({
            redirectTo: '/index/1'
        })
}]);

app.controller('appController',function($scope,$rootScope,$routeParams,$http){

    //URL : /.../.../attr1/page
    //var attr1 = $routeParams.attr1;
    //var page = $routeParams.page;

    //URL : /.../.../page
    var page = parseInt($routeParams.page,10);

    //console.log("page:"+page);

    $scope.$on('pageSize',function(event,data) {

        $rootScope.pagesize = data;
        //console.log("root:"+$rootScope.pagesize);
        var pagesize = parseInt($rootScope.pagesize,10);

        //console.log("pagesize:"+pagesize);

        //there are the GET request to the node + express and the response some json data to angular
        //$http.get('/movie/search/'+attr1+'/'+pagesize+'/'+page)
        //$http.get('/movie/search/'+pagesize+'/'+page)
        //    .success(function(json){
        //        $scope.movies = json.movies;
        //         $rootScope.title = json.title;
        //         $scope.totalPages = json.totalPages;
        //        var data = {
        //            totalPages : json.totalPages,
        //            currentPage : json.currentPage,
        //            keyword : keyword
        //        };
        //        $scope.$broadcast('searchmovies',data);
        //    });

        $http.get('list.json')
            .success(function(data){

                //this logic can use in the node + express
                var current = (page - 1) * pagesize;//page start by 1 ,items start by 0
                var items = data || [];
                var totallist = items.length;
                items = items.slice(current,current+pagesize);
                var totalPages = Math.ceil(totallist / pagesize);

                //console.log("current:"+current);
                //console.log("totallist:"+totallist);
                //console.log("totalPages:"+totalPages);

                //console.log(items);

                $scope.list = items;//show in the page
                $scope.title = "Music";

                var data = {
                    totalPages : totalPages,
                    currentPage : page,
                    //attr1 : attr1
                };
                $scope.$broadcast('musiclist',data);
            })
    });
});


//创建指令
app.directive('pagination',function(){
    var li= '<nav class="text-center"> ' +
        '<ul class="pagination"> ' +
        '<li> ' +
        '<a href="" aria-label="Previous" ng-click="firstpage()"> ' +
        '<span aria-hidden="true">&laquo;</span> ' +
        '</a> ' +
        '</li> ' +
        '<li> ' +
        '<a ng-hide="sign == 1" href="" aria-label="Previous" ng-click="lastgroup()"> ' +
        '<span aria-hidden="true">...</span> ' +
        '</a> ' +
        '</li> ' +
        '<li ng-repeat="num in totalPages" ng-class=\'{true: "active", false: "inactive"}[currentPage==num]\'> ' +
        '<a  href={{url}}/{{num}} >' +
        '{{num}} ' +
        '</a> ' +
        '</li> ' +
        '<li> ' +
        '<a ng-hide="sign >= pages-9" href="" aria-label="Next" ng-click="nextgroup()"> ' +
        '<span aria-hidden="true">...</span> ' +
        '</a> ' +
        '</li> ' +
        '<li> ' +
        '<a href="" aria-label="Next" ng-click="lastpage()"> ' +
        '<span aria-hidden="true">&raquo;</span> ' +
        '</a> ' +
        '</li> ' +
        '</ul> ' +
        '</nav>';

    return {
        restrict : 'E',

        replace : true,
        template : li,
        link : function(scope,element,attrs) {
            scope.$emit('pageSize',attrs.pagesize);

            scope.$on(attrs.paginationName,function(even,data){

                scope.pages = data.totalPages;
                scope.totalPages = [];
                //scope.sign=data.currentPage;
                if(data.currentPage%10 == 0){
                    scope.sign = data.currentPage - 9;
                }else{
                    scope.sign = data.currentPage - data.currentPage%10 + 1 ;
                }
                scope.currentPage = data.currentPage;
                scope.url = attrs.url;
                if(scope.pages>10){
                    for (var i = 0; i < 10; i++) {
                        scope.totalPages.push(i + 1);
                    }
                }else{
                    for (var i = 0; i < scope.pages; i++) {
                        scope.totalPages.push(i + 1);
                    }
                }

                scope.currentPage = data.currentPage;
                scope.url = attrs.url;
                if(attrs.urlAtt1Name){
                    scope.url =  scope.url +"/"+ data[attrs.urlAtt1Name];
                }
                if(attrs.urlAtt2Name){
                    scope.url =  scope.url +"/"+ data[attrs.urlAtt2Name] ;
                }
            });

            scope.nextgroup = function(){
                scope.sign = parseInt(scope.sign)+10
            };
            scope.lastgroup = function(){
                if(parseInt(scope.sign)-10 >= 1){
                    scope.sign = parseInt(scope.sign)-10;
                }else{
                    scope.sign = 1;
                }
            };

            scope.$watch('sign',function(){
                if(scope.sign){
                    if(parseInt(scope.sign) >= parseInt(scope.pages)){
                        scope.sign =scope.pages - scope.pages%10 + 1;
                    }
                    var sign2 = parseInt(scope.sign);
                    var countpage = [];
                    for(; sign2 < parseInt(scope.sign)+10 && sign2 <= parseInt(scope.pages);sign2++){
                        countpage.push(sign2);
                    }
                    scope.totalPages = countpage;
                }
            });

            scope.firstpage = function(){
                window.location = scope.url +"/" + 1;
                scope.sign = 1;
            };

            scope.lastpage = function(){
                window.location = scope.url +"/" + scope.pages;
                scope.sign =scope.pages - scope.pages%10 + 1;
            };

        }
    };
});