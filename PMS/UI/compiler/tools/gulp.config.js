const gulpConfig = {
  name: 'Rider',
  desc: "Gulp build config file",
  version: "1.0.1",
  config: {
    debug: false,
    compile: {
      rtl: {
        enabled: true,
        skip: [
          "select2",
          "line-awesome",
          "fontawesome5",
          "nouislider",
          "tinymce",
          "sweetalert2",
        ],
      },
      jsMinify: true,
      cssMinify: true,
      jsSourcemaps: true,
      cssSourcemaps: true,
    },
    path: {
      src: "../src",
      common_src: "../src",
      node_modules: "node_modules",
      axpert_dir: "../../../",
    },
    dist: ["../../../UI/axpertUI"],
  },
  build: {
    base: {
      src: {
        mandatory: {
          global: {
            styles: ["{$config.path.src}/sass/style.scss"],
            scripts: [
              "{$config.path.common_src}/js/components/util.js",
              "{$config.path.common_src}/js/components/cookie.js",
              "{$config.path.common_src}/js/components/drawer.js",
              "{$config.path.common_src}/js/components/event-handler.js",
              "{$config.path.common_src}/js/components/feedback.js",
              "{$config.path.common_src}/js/components/image-input.js",
              "{$config.path.common_src}/js/components/menu.js",
              "{$config.path.common_src}/js/components/scroll.js",
              "{$config.path.common_src}/js/components/scrolltop.js",
              "{$config.path.common_src}/js/components/search.js",
              "{$config.path.common_src}/js/components/stepper.js",
              "{$config.path.common_src}/js/components/sticky.js",
              "{$config.path.common_src}/js/components/swapper.js",
              "{$config.path.common_src}/js/components/toggle.js",
              "{$config.path.common_src}/js/layout/app.js",
              "{$config.path.common_src}/js/layout/header.js",
              "{$config.path.common_src}/js/layout/search.js",
            ],
            fonts: [
              "{$config.path.src}/fonts/**",
            ]
          }
        },
        optional: {}
      },
      dist: {
        styles: "{$config.dist}/style.bundle.css",
        scripts: "{$config.dist}/scripts.bundle.js",
        fonts: "{$config.dist}/fonts",
      },
    },
    plugins: {
      global: {
        src: {
          mandatory: {
            jquery: {
              scripts: ["{$config.path.node_modules}/jquery/dist/jquery.js"],
            },
            "popper.js": {
              scripts: [
                "{$config.path.node_modules}/@popperjs/core/dist/umd/popper.js",
              ],
            },
            bootstrap: {
              scripts: [
                "{$config.path.node_modules}/bootstrap/dist/js/bootstrap.min.js",
              ],
            },
            moment: {
              scripts: [
                "{$config.path.node_modules}/moment/min/moment-with-locales.min.js",
              ],
            },
            wnumb: {
              scripts: ["{$config.path.node_modules}/wnumb/wNumb.js"],
            },
          },
          optional: {
            select2: {
              styles: [
                "{$config.path.node_modules}/select2/dist/css/select2.css",
              ],
              scripts: [
                "{$config.path.node_modules}/select2/dist/js/select2.full.js",
                "{$config.path.common_src}/js/vendors/plugins/select2.init.js",
              ],
            },
            BS5Modal: {
              scripts: [
                "{$config.path.common_src}/plugins/BS5Modal/BS5Modal.js",
              ],
            },
            invertColor: {
              scripts: [
                "{$config.path.common_src}/plugins/invert-color/lib/invert.js",
              ],
            },
            flatpickr: {
              styles: [
                "{$config.path.node_modules}/flatpickr/dist/flatpickr.css",
              ],
              scripts: [
                "{$config.path.node_modules}/flatpickr/dist/flatpickr.js",
                "{$config.path.common_src}/js/vendors/plugins/flatpickr.init.js",
              ],
            },
            "tiny-slider": {
              styles: [
                "{$config.path.node_modules}/tiny-slider/dist/tiny-slider.css",
              ],
              scripts: [
                "{$config.path.node_modules}/tiny-slider/dist/tiny-slider.js",
              ],
            },
            dropzone: {
              styles: [
                "{$config.path.node_modules}/dropzone/dist/dropzone.css",
              ],
              scripts: [
                "{$config.path.node_modules}/dropzone/dist/dropzone.js"
              ],
            },
            toastr: {
              styles: ["{$config.path.node_modules}/toastr/build/toastr.css"],
              scripts: ["{$config.path.node_modules}/toastr/toastr.js"],
            },
            sweetalert2: {
              styles: [
                "{$config.path.node_modules}/sweetalert2/dist/sweetalert2.css",
              ],
              scripts: [
                "{$config.path.node_modules}/es6-promise-polyfill/promise.min.js",
                "{$config.path.node_modules}/sweetalert2/dist/sweetalert2.min.js",
                "{$config.path.common_src}/js/vendors/plugins/sweetalert2.init.js",
              ],
            },
          },
          override: {
            styles: ["{$config.path.src}/sass/plugins.scss"],
          },
        },
        dist: {
          styles: "{$config.dist}/plugins.bundle.css",
          scripts: "{$config.dist}/plugins.bundle.js",
          images: "{$config.dist}/images",
          fonts: "{$config.dist}/fonts",
        },
      },
      custom: {
        "datatables.net": {
          src: {
            styles: [
              "{$config.path.node_modules}/datatables/media/css/jquery.dataTables.css",
              "{$config.path.node_modules}/datatables.net-fixedcolumns-dt/css/fixedColumns.dataTables.css",
            ],
            scripts: [
              "{$config.path.node_modules}/datatables/media/js/jquery.dataTables.js",
              "{$config.path.node_modules}/jszip/dist/jszip.min.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/Buttons/js/pdfmake.js",
              "{$config.path.node_modules}/pdfmake/build/vfs_fonts.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/Buttons/js/dataTables.buttons.js",
              // "{$config.path.node_modules}/datatables.net-buttons/js/buttons.flash.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/Buttons/js/buttons.html5.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/Buttons/js/buttons.print.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/ColReorderWithResize/ColReorderWithResize.js",
              "{$config.path.node_modules}/datatables.net-fixedcolumns/js/dataTables.fixedColumns.js",
              "{$config.path.node_modules}/datatables.net-scroller/js/dataTables.scroller.js",
              "{$config.path.node_modules}/moment/min/moment.min.js",
              "{$config.path.node_modules}/jquery-visible/jquery.visible.min.js",
              "{$config.path.axpert_dir}/ThirdParty/DataTables-1.10.13/extensions/Extras/datetime-moment.js",
            ],
            images: [
              "{$config.path.node_modules}/datatables/media/images/*.png",
            ]
          },
          dist: {
            styles:
              "{$config.dist}/datatables.bundle.css",
            scripts:
              "{$config.dist}/datatables.bundle.js",
            images: "{$config.dist}/images/datatables",
          }
        }
      }
    }
  },
};

export { gulpConfig };
