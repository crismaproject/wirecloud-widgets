/*
 Peter.Kutschera@ait.ac.at, 2013-10-25
 Time-stamp: "2014-02-26 14:09:48 peter"

 See http://blog.pixelingene.com/2011/07/building-a-tree-diagram-in-d3-js/

*/
/*

    Copyright (C) 2014  AIT / Austrian Institute of Technology
    http://www.ait.ac.at
 
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as
    published by the Free Software Foundation, either version 2 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/gpl-2.0.html
*/
  
function createTreeData (wsid, list) {
    var treeData = getFromList (wsid, list);
    var branches = setBranchNumber (0, treeData);
    return treeData;
}

////////////////////////
/*
  get tree of WorldStates from list of all WorldStates
  Start with wsid
*/
function getFromList (wsid, list) {
    // console.log ("getFromList (" + wsid + ", list)");
    var tmp = { wsid : wsid, label: "id: " + wsid, children : [] };
    for (var i = 0; i < list.length; i++) {
		if (list[i].id === wsid) {
			if (list[i].name) {
				tmp.label = list[i].name;
			} else {
				tmp.label = "undefined";
			}
			var temp_coverage_defined = false;
			var tm = new Date();
			if (list[i].worldstatedata && list[i].worldstatedata.length > 0) {
				// search for the earliest temporal coverage start time in all worldstate data:
				for (var j = 0; j < list[i].worldstatedata.length; j++) {
					if (list[i].worldstatedata[j].temporalcoveragefrom) {
						var ws_tm = new Date(list[i].worldstatedata[j].temporalcoveragefrom);
						if (tm > ws_tm ) {
							tm = ws_tm;
							temp_coverage_defined = true;
						}
					}
				}
			}
			if (list[i].simulatedTime) {
				tmp.time = list[i].simulatedTime;
			} else if (temp_coverage_defined) {
				tmp.time = tm.toISOString();
			} else {
				tmp.time = list[i].created;
			}
			tmp.data = list[i];
			break;
		}
    }
    //    console.log ("label = " + tmp.label);
    for (var i = 0; i < list.length; i++) {
		if (list[i].parentworldstate && (list[i].parentworldstate.id === wsid || (list[i].parentworldstate.$ref && list[i].parentworldstate.$ref.indexOf(wsid) > -1))) {
			tmp.children.push (getFromList (list[i].id, list));
		}
    }
    return tmp;
}


function setBranchNumber (number, node) {
    node.branchNumber = number;
    for (var i = 0; i < node.children.length; i++) {
		number = setBranchNumber (number, node.children[i]);
		if (i + 1 < node.children.length) {
			number++;
		}
    }
    return number;
}

