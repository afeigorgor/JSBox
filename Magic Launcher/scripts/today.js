let ui = require('scripts/ui')
let utils = require('scripts/utils')
let widget = require('scripts/widget')

function setupTodayView() {
  let items = ui.addButtonMore(utils.getCache("inappItems", []))
  let columns = utils.getCache("inappcolumns")
  let itemHeight = 35
  let wantToClose = false
  let showView = []
  if($app.widgetIndex == -1 && utils.getCache("pullToClose")) {
    showView = [{
      type: "matrix",
      props: {
        id: "rowsShow",
        columns: columns, //横行个数
        itemHeight: itemHeight, //图标到字之间得距离
        spacing: 8, //每个边框与边框之间得距离
        bgcolor: $color("clear"),
        template: ui.genTemplate("inapp"),
        data: items,
        showsVerticalIndicator: false,
      },
      layout: function(make, view) {
        make.width.equalTo(view.super)
        make.centerX.equalTo(view.super)
        make.top.bottom.inset(0)
      },
      events: {
        didSelect(sender, indexPath, data) {
          $device.taptic(1)
          if(data.type == "Folder") {
            widget.pushFolderView(data.content)
          } else {
            utils.myOpenContent(data.type, data.content)
          }
        },
        didScroll: function(sender) {
          if(sender.contentOffset.y < -30) {
            if(!wantToClose) {
              wantToClose = true
              $device.taptic(2)
              let color = utils.randomValue(utils.colors)
              $("closeView").icon = $icon("225", color, $size(17, 17))
              $("closeView").titleColor = color
            }
          } else{
            wantToClose = false
            $("closeView").icon = $icon("225", $rgba(100, 100, 100, 0.3), $size(17, 17))
            $("closeView").titleColor = $rgba(100, 100, 100, 0.3)
          }
        },
        didEndDragging: function(sender, decelerate) {
          if(wantToClose) {
            $app.close()
          }
        }
      },
      views: [{
        type: "button",
        props: {
          id: "closeView",
          title: " CLOSE",
          bgcolor: $color("clear"),
          icon: $icon("225", $rgba(100, 100, 100, 0.3), $size(17, 17)),
          titleColor: $rgba(100, 100, 100, 0.3),
          font: $font("bold", 15),
          hidden: false,
          radius: 15,
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super)
          make.top.inset(0).offset(-30)
          make.width.equalTo(80)
          make.height.equalTo(30)
        },
      },]
    }]
  } else {
    showView = [{
      type: "matrix",
      props: {
        id: "rowsShow",
        columns: columns, //横行个数
        itemHeight: itemHeight, //图标到字之间得距离
        spacing: 8, //每个边框与边框之间得距离
        bgcolor: $color("clear"),
        template: ui.genTemplate("inapp"),
        data: items,
        showsVerticalIndicator: false,
      },
      layout: function(make, view) {
        make.width.equalTo(view.super)
        make.centerX.equalTo(view.super)
        make.top.equalTo(view.prev.bottom)
        make.bottom.inset(0)
      },
      events: {
        didSelect(sender, indexPath, data) {
          $device.taptic(1)
          if(data.type == "Folder") {
            widget.pushFolderView(data.content)
          } else {
            utils.myOpenContent(data.type, data.content)
          }
        },
      },
    }]
  }

  $ui.render({
    props: {
      id: "todayView",
      title: "Launch Center",
      navBarHidden: true
    },
    layout: $layout.fill,
    views: showView,
  })

  if($app.widgetIndex == -1 && !utils.getCache("staticHeight")) {
    if(utils.getCache("pullToClose")) {
      $widget.height = 215
    } else {
      $widget.height = 245
    }
  }

  if($app.widgetIndex == -1 && utils.getCache("pullToClose") == true && !utils.getCache("isPullToCloseToasted", false)) {
    $cache.set("isPullToCloseToasted", true);
    $delay(1, function(){
      ui.showToastView($("todayView"), utils.mColor.blue, "下拉即可关闭 ↓")
    })
  }
}



module.exports = {
  show: setupTodayView
}
