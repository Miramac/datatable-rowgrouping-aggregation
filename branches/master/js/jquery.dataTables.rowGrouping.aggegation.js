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
	*	- total aggregation: on single base or on group base (for now it is on group base)
	*	- numberFormat
	* 	- output
	*	- reander after changes (like column sorting)
	* 	- CSS & Styling
	*/
	$(function ($) {
		$.fn.groupAggregation = function (options) {
		//Default Options
		var defaults = {
			"groupAggregaions":[{
				"colIndex":1, 					//noch nicht genutz, evtl für aufbau der Spalten
				"aggregation":"sum"			
			}],
			"valueSelector":"td.group-agr",		//Selector to get all Value-Cells
			"cssClass":"center",				//Custom CSS Class for aggregation result cells
			"totalLabel":"Gesamt"				//left label for total row
		};
		options =  $.extend(defaults, options); 
		
		/** 
		*	Aggregation function
		* 	@todo use numer format function
		*	@param {string} aggregation				String	type of aggr.
		*	@param {array} values					Array	the single values
		*	@param {string} numberFormat [false]	Number formart
		**/
		function aggregate(aggregation,values,numberFormat){
			if(typeof(numberFormat) === undefined) numberFormat=false;
			if(typeof(values) == 'array') return values;
			switch(aggregation.toLowerCase()) {
				case 'sum':
					for(var i=0,sum=0;i<values.length;sum+=values[i++]);
					return (Math.round(sum*100)/100); //Fake number formart
					break;
				case 'avg':
					for(var i=0,sum=0;i<values.length;sum+=values[i++]);
					return (Math.round(sum/values.length*100)/100);
					break;
				case 'min':
					return Math.min.apply({},values)
					break;
				case 'max':
					return Math.max.apply({},values)
					break;
			}
		}
		
		
		/** jQuery Element Loop
		**/
		 return this.each(function (index, elem) {
			var groups = [[],[]]; //Array of all group collections
			var table = $(elem);
			var groupRows = $('td.group', table);
			var colspan;
			if(!groupRows.length>0) return; //No Grouping Table
			groupRows.each(function(index){
				var group = {
					"name":$(this).attr('class').split(" ")[1],		//interner Groupname
					"columns": [[],[]]	//Werte pro Aggr. [ColIndex,Values] ToDo: better data managment!!
					};
				//Select Group Value Cells
				var groupItemRows = $('tr.group-item-'+group.name, table);
				var groupValueCells = $(options.valueSelector,groupItemRows);
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
					html += '<td class="group '+options.cssClass+'">';
					//Aggregation
					html += aggregate(options.groupAggregaions[i].aggregation,group.columns[i]);//Math.round(group.columns[i].sum()*100)/100;
					groups[i].push (aggregate(options.groupAggregaions[i].aggregation,group.columns[i]));
					html += '</td>';
					//reset Group-Values
					group.columns[i] = [];
				}
				//save colspan value for total row
				colspan = $(this).attr('colspan');
				//remove colspan for group Row
				$(this).removeAttr('colspan');
				//Add to Group Row
				$('#group-id-dynamic-table-'+group.name).append(html); //Table-ID hartgecodet!!
			});
			if(groups.length>0) {
				//Total Row
				var totalRowHtml = '<tr><td colspan="'+colspan+'"></td>'; //Spacer
				totalRowHtml += '<tr><td class="group">'+options.totalLabel+'</td>';
				for (var i=0;i<options.groupAggregaions.length;i++) {
					totalRowHtml += '<td class="group '+options.cssClass+'">';
					totalRowHtml += aggregate(options.groupAggregaions[i].aggregation,groups[i])
					totalRowHtml += '</td>';
				}
				totalRowHtml += '</tr>';
				$('tr:last',table).after(totalRowHtml);
			}
		});	//Each Table.
		
	}//End Func. rowAgr()
})
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		