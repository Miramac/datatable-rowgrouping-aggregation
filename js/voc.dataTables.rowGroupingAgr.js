	/**
	*	Adding aggregation to then jQuery-pluggin datatables-row-grouping
	*	@see jquery-1.4.js, jquery.dataTable.js, jquery.dataTable.rowGrouping.js (http://jquery-datatables-row-grouping.googlecode.com/svn/trunk/index.html)
	*	@param {number} colIndex		noch nicht genutz, evtl für Aufbau der Spalten
	*	@param {string} aggregation		Art der Aggr. mögiche Optionen:  sum,avg,min,max
	* 	@param {string} agrRowClass		CSS-Class für Gesamtspalten
	*	@param {string} numberFormat	Angabe zum Nummernformat
	*
	*	ToDos:
	*  	- new Data managment
	*	- total aggregation: on single base or on group base (at the moment on group base)
	*	- numberFormat
	* 	- output
	*	- reander after changes (like column sorting)
	* 	- CSS & Styling
	*/
	$(function ($) {
		$.fn.rowAgr = function (options) {
		//Default Options
		var defaults = {
			"groupAggregaions":[{
				"colIndex":1, //noch nicht genutz, evtl für aufbau der Spalten
				"aggregation":"sum"
			}]
		};
		options =  $.extend(defaults, options); //Add Defaults to Option
		
		/** 
		*	Aggregation function
		* 	@todo use numer format function
		*	@param {string} aggregation				String	type of aggr.
		*	@param {array} values					Array	the single values
		*	@param {string} numberFormat [false]	Number formart
		**/
		function aggregate(aggregation,values,numberFormat){
			if(typeof(numberFormat) == 'undefined')numberFormat=false;
			if(typeof(values) == 'array') return values;
			switch(aggregation.toLowerCase()) {
				case 'sum':
					for(var i=0,sum=0;i<values.length;sum+=values[i++]);
					return (Math.round(sum*100)/100); //Fake number formart
					break
				case 'avg':
					for(var i=0,sum=0;i<values.length;sum+=values[i++]);
					return (Math.round(sum/values.length*100)/100);
					break
				case 'min':
					return Math.min.apply({},values)
					break
				case 'max':
					return Math.max.apply({},values)
					break
			}
		};
		
		
		/** jQuery Element Loop
		**/
		 return this.each(function (index, elem) {
			var groups = [[],[]]; //All Group Values, need to be changed!
			var table = $(elem);
			var groupRows = $('td.group', table);
			if(!groupRows.length>0) return; //No Grouping Table
			groupRows.each(function(index){
				var group = {
					"name":$(this).attr('class').split(" ")[1],		//interner Groupname
					"columns": [[],[]]	//Werte pro Aggr. [ColIndex,Values] ToDo: better data managment!!
					};
				//Select Group Value Cells
				var groupItemRows = $('tr.group-item-'+group.name, table);
				var groupValueCells = $('td.group-agr',groupItemRows);
				groupValueCells.each(function(index) {
					var colIndex = 0;//Default auf erste Aggr. Spalte
					for(var i=1; i<options.groupAggregaions.length; i++) { //teste alle Spalte >1
						var testIndex = ((index+1)%(i+1))
						if(testIndex == 0) {
							colIndex = i;
						}
					}
					group.columns[colIndex].push (parseFloat($(this).text()));
				});
				
				
				//Ausgabe -> needs to be changed!
				var html = '';
				for(var i=0; i<options.groupAggregaions.length; i++) { 
					html += '<td class="center group">';
					//Aggregation
					html += aggregate(options.groupAggregaions[i].aggregation,group.columns[i]);//Math.round(group.columns[i].sum()*100)/100;
					groups[i].push (aggregate(options.groupAggregaions[i].aggregation,group.columns[i]));
					html += '</td>';
					//reset Group-Values
					group.columns[i] = [];
				}
				//colspan entfernen
				$(this).removeAttr('colspan');
				//Add to Group Row
				$('#group-id-dynamic-table-'+group.name).append(html);
			});
			if(groups.length>0) {
				//Total Row
				var totalRowHtml = '<tr><td colspan="3"></td>'; //Spacer
				totalRowHtml += '<tr><td class="group">Gesamt</td>';
				for (var i=0;i<options.groupAggregaions.length;i++) {
					totalRowHtml += '<td class="center group">';
					totalRowHtml += aggregate(options.groupAggregaions[i].aggregation,groups[i])
					totalRowHtml += '</td>';
				}
				totalRowHtml += '</tr>';
				$('tr:last',table).after(totalRowHtml);
			}
		});	//Each Table.
		
	}//End Func. rowAgr()
})
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		