/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim:set ts=2 sw=2 sts=2 et: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Darin Fisher <darin@meer.net>
 *  Boris Zbarsky <bzbarsky@mit.edu>
 *  Jeff Walden <jwalden+code@mit.edu>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/* This file contains common code that is loaded with each test file.
 * See http://developer.mozilla.org/en/docs/Writing_xpcshell-based_unit_tests
 * for more information
 */

var _quit = false;
var _fail = false;
var _tests_pending = 0;

function _TimerCallback(expr) {
  this._expr = expr;
}
_TimerCallback.prototype = {
  _expr: "",
  QueryInterface: function(iid) {
    if (iid.Equals(Components.interfaces.nsITimerCallback) ||
        iid.Equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_ERROR_NO_INTERFACE;
  },
  notify: function(timer) {
    eval(this._expr);
  }
};

function _do_main() {
  if (_quit)
    return;

  dump("*** running event loop\n");
  var thr = Components.classes["@mozilla.org/thread-manager;1"]
                      .getService().currentThread;

  while (!_quit)
    thr.processNextEvent(true);

  while (thr.hasPendingEvents())
    thr.processNextEvent(true);
}

function _do_quit() {
  dump("*** exiting\n");

  _quit = true;
}

function _find_and_run_tests() {
  var parent = this;

  var tests = [];

  for (prop in parent)
    if (prop.indexOf("test") == 0)
      tests.push(prop);

  if (tests.length == 0)
    throw new Error("No run_test() found, nor any functions that " +
                    "begin with 'test'!");

  var numFailed = 0;

  for (var i = 0; i < tests.length; i++) {
    var test = tests[i];
    dump("Running test: " + test + "\n");
    try {
      parent[test]();
    } catch (e) {
      _display_exception(e);
      numFailed++;
    }
  }

  var numPassed = tests.length - numFailed;
  var outcome = numPassed + " of " + tests.length + " tests passed.";

  if (numFailed)
    throw new Error(outcome);
  else
    dump(outcome + "\n");
}

function _display_exception(e) {
  dump("An exception occurred: ");
  dump(e + "\n\n");
  dump("Traceback:\n\n");
  if (e.location) {
    let frame = e.location;
    while (frame) {
      dump(frame + "\n");
      frame = frame.caller;
    }
  } else if (e.stack)
    dump(e.stack);
  else
    dump("No traceback available.\n");
}

function _execute_test(func) {
  if (typeof func == "undefined")
    func = _find_and_run_tests;

  try {
    do_test_pending();
    func();
    do_test_finished();
    _do_main();
  } catch (e) {
    _fail = true;
    _display_exception(e);
  }

  if (_fail)
    dump("*** FAIL ***\n");
  else
    dump("*** PASS ***\n");
}

/************** Functions to be used from the tests **************/

function do_timeout(delay, expr) {
  var timer = Components.classes["@mozilla.org/timer;1"]
                        .createInstance(Components.interfaces.nsITimer);
  timer.initWithCallback(new _TimerCallback(expr), delay, timer.TYPE_ONE_SHOT);
}

function do_throw(text) {
  _fail = true;
  _do_quit();
  dump("*** CHECK FAILED: " + text + "\n");
  var frame = Components.stack;
  while (frame != null) {
    dump(frame + "\n");
    frame = frame.caller;
  }
  throw Components.results.NS_ERROR_ABORT;
}

function do_check_neq(left, right) {
  if (left == right)
    do_throw(left + " != " + right);
}

function do_check_eq(left, right) {
  if (left != right)
    do_throw(left + " == " + right);
}

function do_check_true(condition) {
  do_check_eq(condition, true);
}

function do_check_false(condition) {
  do_check_eq(condition, false);
}

function do_test_pending() {
  dump("*** test pending\n");
  _tests_pending++;
}

function do_test_finished() {
  dump("*** test finished\n");
  if (--_tests_pending == 0)
    _do_quit();
}

function do_import_script(topsrcdirRelativePath) {
  var scriptPath = environment.get("TOPSRCDIR");
  if (scriptPath.charAt(scriptPath.length - 1) != "/")
    scriptPath += "/";
  scriptPath += topsrcdirRelativePath;

  load(scriptPath);
}

function do_get_file(path, allowInexistent) {
  var comps = path.split("/");
  try {
    // The following always succeeds on Windows because we use cygpath with
    // the -a (absolute) modifier to generate NATIVE_TOPSRCDIR.
    var lf = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);
    lf.initWithPath(environment.get("NATIVE_TOPSRCDIR"));
  } catch (e) {
    // Relative -- and not-Windows per above
    lf = Components.classes["@mozilla.org/file/directory_service;1"]
                   .getService(Components.interfaces.nsIProperties)
                   .get("CurWorkD", Components.interfaces.nsILocalFile);

    // We can't use appendRelativePath because it's not supposed to work with
    // paths containing "..", and this path might contain "..".
    var topsrcdirComps = environment.get("NATIVE_TOPSRCDIR").split("/");
    Array.prototype.unshift.apply(comps, topsrcdirComps);
  }

  for (var i = 0, sz = comps.length; i < sz; i++) {
    // avoids problems if either path ended with /
    if (comps[i].length > 0)
      lf.append(comps[i]);
  }

  if (!allowInexistent) {
    if (!lf.exists()) {
      print(lf.path + " doesn't exist\n");
    }
    do_check_true(lf.exists());
  }

  return lf;
}

function do_load_module(path) {
  var lf = do_get_file(path);
  const nsIComponentRegistrar = Components.interfaces.nsIComponentRegistrar;
  do_check_true(Components.manager instanceof nsIComponentRegistrar);
  Components.manager.autoRegister(lf);
}

function do_bind_resource(path, alias) {
  var ioService = Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService);
  var resProt = ioService.getProtocolHandler("resource")
    .QueryInterface(Components.interfaces.nsIResProtocolHandler);

  var dir = path;
  if (!(dir instanceof Components.interfaces.nsIFile)) {
    var dir = Cc["@mozilla.org/file/local;1"]
      .createInstance(Components.interfaces.nsILocalFile);
    dir.initWithPath(path);
  }
  var uri = ioService.newFileURI(dir);

  resProt.setSubstitution(alias, uri);
}

/**
 * Parse a DOM document.
 *
 * @param aPath File path to the document.
 * @param aType Content type to use in DOMParser.
 *
 * @return nsIDOMDocument from the file.
 */
function do_parse_document(aPath, aType) {
  switch (aType) {
    case "application/xhtml+xml":
    case "application/xml":
    case "text/xml":
      break;

    default:
      throw new Error("do_parse_document requires content-type of " +
                      "application/xhtml+xml, application/xml, or text/xml.");
  }

  var lf = do_get_file(aPath);
  const C_i = Components.interfaces;
  const parserClass = "@mozilla.org/xmlextras/domparser;1";
  const streamClass = "@mozilla.org/network/file-input-stream;1";
  var stream = Components.classes[streamClass]
                         .createInstance(C_i.nsIFileInputStream);
  stream.init(lf, -1, -1, C_i.nsIFileInputStream.CLOSE_ON_EOF);
  var parser = Components.classes[parserClass]
                         .createInstance(C_i.nsIDOMParser);
  var doc = parser.parseFromStream(stream, null, lf.fileSize, aType);
  parser = null;
  stream = null;
  lf = null;
  return doc;
}
