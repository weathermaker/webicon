'use strict';

service('SvgCumulativeIconSetScope', function(service) {
  var
    AbstractRemoteSvgResourceScope = service('AbstractRemoteSvgResourceScope'),
    inherit = service('inherit')
    ;

  function SvgCumulativeIconSetScope(id, urlConfig, options) {
    var
      DEFAULT_WAIT_DURATION = 10;

    AbstractRemoteSvgResourceScope.call(this, id, urlConfig, options);

    this.waitDuration = options.waitDuration || DEFAULT_WAIT_DURATION;
    this.waitPromise = null;
    this.waitIconIds = [];
  }

  return inherit(SvgCumulativeIconSetScope, AbstractRemoteSvgResourceScope, {

    _loadResource: function() {
      var
        SvgIconSet = service('SvgIconSet');
      return SvgIconSet.loadByUrl(this.urlResolver(this.waitIconIds), this.svgOptions);
    },

    preLoad: function() {
      return true;
    },

    getIcon: function(iconId) {
      var
        Promise = service('Promise'),
        timeout = service('timeout'),
        self = this;

      if (this._resource && this._resource.exists(iconId)) {
        return Promise.resolve(this._resource.getIconById(iconId));
      }

      if (this.waitPromise) {
        if (this.waitIconIds.indexOf(iconId) == -1) {
          this.waitIconIds.push(iconId);
        }
      }
      else {
        this.waitIconIds = [iconId];
        this.waitPromise = timeout(this.waitDuration).then(function() {
          self.waitPromise = null;
          if (!self._resource) {
            return self._getResource();
          }
          return self._resource.mergeByUrl(
            self.urlResolver(self._resource.notExists(self.waitIconIds)),
            self.svgOptions
          );
        });
      }

      return this.waitPromise
        .then(function(iconSet) {
          var
            icon = iconSet.getIconById(iconId);
          return icon
            ? icon
            : Promise.reject();
        });
    }

  });

});