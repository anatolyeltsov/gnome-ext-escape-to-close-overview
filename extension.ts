import Clutter from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import {
  Extension,
  InjectionManager,
} from "resource:///org/gnome/shell/extensions/extension.js";

export default class EscapeToCloseOverviewExtension extends Extension {
  _injectionManager: InjectionManager | null | undefined = undefined;

  enable() {
    this._injectionManager = new InjectionManager();

    this._injectionManager.overrideMethod(
      Main.overview._overview.controls._searchController,
      // @ts-ignore
      "_onStageKeyPress",
      () => {
        // Based on method in https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/searchController.js
        return function () {
          if (Main.modalCount > 1) return Clutter.EVENT_PROPAGATE;

          // Leave @ts-ignore comment until full typings for search controller are available
          // @ts-ignore
          const [, symbol] = this._stageKeyController.get_key();

          if (symbol === Clutter.KEY_Escape) {
            // @ts-ignore
            if (this._searchActive) this.reset();
            else Main.overview.hide();

            return Clutter.EVENT_STOP;
          }

          return Clutter.EVENT_PROPAGATE;
        };
      },
    );
  }

  disable() {
    this._injectionManager?.clear();
    this._injectionManager = null;
  }
}
