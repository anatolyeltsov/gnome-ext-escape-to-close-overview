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
      "_onStageKeyPress",
      () => {
        // Based on method in https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/searchController.js
        return function (_actor, event) {
          if (Main.modalCount > 1) return Clutter.EVENT_PROPAGATE;

          // Leave @ts-ignore comment until full typings for search controller are available
          // @ts-ignore
          const symbol = event.get_key_symbol();

          if (symbol === Clutter.KEY_Escape) {
            if (this._searchActive) this.reset();
            else Main.overview.hide();

            return Clutter.EVENT_STOP;
          } else if (this._shouldTriggerSearch(symbol)) {
            this.startSearch(event);
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
