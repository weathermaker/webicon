
describe('angular extensions fontawesome', function() {
  var
    element,
    $i8IconProvider,
    $compile,
    $templateCache,
    $scope;

  beforeEach(module('i8.icon', function(_$i8IconProvider_) {
    $i8IconProvider = _$i8IconProvider_;
  }));

  function make(html) {
    var
      element;
    element = $compile(html)($scope);
    $scope.$digest();
    return element;
  }

  beforeEach(inject(function(_$compile_, _$templateCache_, _$rootScope_){
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    $scope = _$rootScope_;
  }));

  it('should work', function() {
    element = make('<i8-icon icon="fa:home spin 2x"></i8-icon>');
    expect(element.attr('class')).toContain('fa-home fa-spin fa-2x');
  });

});