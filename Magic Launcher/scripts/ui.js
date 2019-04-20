let utils = require("scripts/utils");

function showToastView(view, color, text, duration) {
  let time = new Date().getTime();
  let topInset = view.frame.height / 10;
  let textSize = $text.sizeThatFits({
    text: text,
    width: view.width,
    font: $font(15)
  });
  if (duration === undefined) {
    // duration = text.length / 5;
    duration = 0.4
  }
  let showView = {
    type: "view",
    props: {
      id: "toastView",
      bgcolor: $color("clear"),
      alpha: 0,
      userInteractionEnabled: false,
      info: time
    },
    layout: function(make, view) {
      make.centerX.equalTo(view.super);
      make.top.inset(topInset);
      make.width.equalTo(textSize.width + 60);
      make.height.equalTo(30);
    },
    views: [
      {
        type: "blur",
        props: {
          style: 1, // 0 ~ 5
          radius: 5
        },
        layout: $layout.fill
      },
      {
        type: "image",
        props: {
          icon: $icon("009", $color(color), $size(16, 16)),
          bgcolor: $color("clear")
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super);
          make.size.equalTo($size(16, 16));
          make.left.inset(10);
        }
      },
      {
        type: "view",
        layout: function(make, view) {
          make.centerY.equalTo(view.super);
          make.left.equalTo(view.prev.right).inset(0);
          make.right.inset(10);
          make.height.equalTo(view.super);
        },
        views: [
          {
            type: "label",
            props: {
              text: text,
              bgcolor: $color("clear"),
              textColor: $color(utils.mColor.black),
              font: $font(15)
            },
            layout: function(make, view) {
              make.center.equalTo(view.super);
            }
          }
        ]
      }
    ]
  };
  if ($("toastView") != undefined) {
    $("toastView").remove();
  }
  view.add(showView);
  let fView = $("toastView");
  if (fView == undefined) {
    return 0;
  }
  fView.relayout();
  fView.updateLayout(function(make) {
    make.top.inset(topInset + 20);
  });
  $ui.animate({
    duration: 0.4,
    animation: function() {
      fView.alpha = 1.0;
      fView.relayout();
    },
    completion: function() {
      $delay(duration, function() {
        let fView = $("toastView");
        if (fView == undefined) {
          return 0;
        } else if (fView.info != time) {
          return 0;
        }
        fView.updateLayout(function(make) {
          make.top.inset(topInset);
        });
        $ui.animate({
          duration: 0.4,
          animation: function() {
            fView.alpha = 0.0;
            fView.relayout();
          },
          completion: function() {
            if (fView != undefined) {
              fView.remove();
            }
          }
        });
      });
    }
  });
}

function genTemplate(source) {
  let showMode = 2;
  if(source == "inapp") {
    showMode = utils.getCache("inappshowMode", 0);
  } else if(source == "widget") {
    showMode = utils.getCache("widgetshowMode", 0);
  }
  let template = [];
  if (showMode == 0) {
    template.push(
      {
        type: "blur",
        props: {
          radius: 2.0, //调整边框是什么形状的如:方形圆形什么的
          style: 1 // 0 ~ 5 调整背景的颜色程度
        },
        layout: $layout.fill
      },
      {
        type: "image",
        props: {
          id: "icon",
          radius: 11,
          bgcolor: $rgba(222,227,231,1),
        },
        layout: function(make, view) {
          make.top.inset(5);
          make.centerX.equalTo(view.super);
          make.size.equalTo($size(50, 49));
        }
      },
      {
        type: "label",
        props: {
          id: "title",
          textColor: $color("black"),
          bgcolor: $color("clear"),
          font: $font(12),
          align: $align.center
        },
        layout: function(make, view) {
          // make.top.equalTo(view.prev.bottom).inset();
          make.bottom.inset(0);
          make.centerX.equalTo(view.super);
          make.height.equalTo(13);
          make.width.equalTo(view.super);
        }
      }
      // {
      //   type: "image",
      //   props: {
      //     id: "icon",
      //     bgcolor: $color("clear"),
      //     smoothRadius: 5,
      //     size: $size(20, 20)
      //   },
      //   layout: function(make, view) {
      //     make.top.inset(5);
      //     make.centerX.equalTo(view.super);
      //     make.size.equalTo($size(20, 20));
      //   }
      // }
    );
  } else if (showMode == 1) {
    template.push(
      {
        type: "blur",
        props: {
          circular: true,
          style: 1 // 0 ~ 5 调整背景的颜色程度
        },
        layout: function(make, view) {
          make.center.equalTo(view.super);
          make.size.equalTo($size(40, 40));
        }
      },
      {
        type: "image",
        props: {
          id: "icon",
          bgcolor: $color("clear"),
          smoothRadius: 5,
          size: $size(20, 20)
        },
        layout: function(make, view) {
          make.center.equalTo(view.super);
          make.size.equalTo($size(20, 20));
        }
      }
    );
  } else if (showMode == 2) {
    if(source == "inapp") {
      template.views = [
        {
          type: "image",
          props: {
            id: "icon",
            radius: 8,
            bgcolor: $rgba(222,227,231,1),
          },
          layout: $layout.fill
          // layout: function(make, view) {
          //   make.size.equalTo($size(50, 49));
          // }
        }
      ];
    } else if (source == "widget") {
      template.views = [
        {
          type: "image",
          props: {
            id: "icon",
            radius: 8,
            bgcolor: $rgba(246,246,246,0.5),
          },
          layout: $layout.fill
        }
      ];
    } else {
      template.views = [
        {
          type: "image",
          props: {
            id: "icon",
            radius: 8,
            bgcolor: $rgba(246,246,246,0.5),
          },
          layout: $layout.fill
        }
      ];
    }
  }
  return template;
}

function addButtonMore(items) {
  let from = "widget"
  if ($app.widgetIndex = -1) {
    from = "today"
  }
  items.push({
    title: {
      text: "More"
    },
    icon: {
      src: "assets/more.png"
    },
    type: "Scheme",
    content: "jsbox://run?name=" + encodeURI($addin.current.name) + "&from=" + $app.widgetIndex
  });
  return items;
}

module.exports = {
  showToastView: showToastView,
  genTemplate: genTemplate,
  addButtonMore: addButtonMore
};
