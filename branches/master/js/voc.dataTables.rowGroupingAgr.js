   /**
	* @depends: jquery,jqueryui,dataTable,dataTable.rowGrouping
	* @desc: Fügt Aggregationsergebnisse in die Gruppenzeile ein
	* @created: 10.12.2011
	* @lastupdate: 10.12.2011
	**/ 
	function rowAgr(table, groupAggregaions) {
		/*groupAggregaions = [{
				"colIndex":1, //noch nicht genutz, evtl für aufbau der Spalten
				"aggregation":"sum"
				},{
				"colIndex":2,
				"aggregation":"sum"
				}
			];*/
			var groups = [[],[]];
			var groupRows = $('.group', table);
			groupRows.each(function(index){
				var group = {
					"name":$(this).attr('class').split(" ")[1],		//interner Groupname
					"columns": [[],[]]	//Werte pro Aggr. [ColIndex,Values]
					};
				//Select Group Value Cells
				var groupItemRows = $('tr.group-item-'+group.name, table);
				var groupValueCells = $('td.group-agr',groupItemRows);
				groupValueCells.each(function(index) {
					var colIndex = 0;//Default auf erste Aggr. Spalte
					for(var i=1; i<groupAggregaions.length; i++) { //teste alle Spalte >1
						var testIndex = ((index+1)%(i+1))
						if(testIndex == 0) {
							colIndex = i;
						}
					}
					group.columns[colIndex].push (parseFloat($(this).text()));
				});
				
				
				//Ausgabe
				var html = '';
				for(var i=0; i<groupAggregaions.length; i++) { 
					html += '<td class="center group">';
					//Aggregation
					if (groupAggregaions[i].aggregation == 'sum') {
						//agr SUM
						html += Math.round(group.columns[i].sum()*100)/100;
						groups[i].push (group.columns[i].sum());
					} else if (groupAggregaions[i].aggregation == 'avg'){
						//agr AVG
						html += Math.round(group.columns[i].avg()*100)/100;
						groups[i].push (group.columns[i].avg());
					}
					html += '</td>';
					
					//reset Group-Values
					group.columns[i] = [];
				}
				//colspan entfernen
				$(this).removeAttr('colspan');
				//Add to Group Row
				$('#group-id-dynamic-table-'+group.name).append(html);
			});
			
			//Gesamt Zeile
			var totalRowHtml = '<tr><td colspan="3"></td>'; //Spacer
			totalRowHtml += '<tr><td class="group">Gesamt</td>';
			for (var i=0;i<groupAggregaions.length;i++) {
				totalRowHtml += '<td class="center group">';
					if (groupAggregaions[i].aggregation == 'sum') {
						totalRowHtml += Math.round(groups[i].sum()*100)/100;
					} else if (groupAggregaions[i].aggregation == 'avg'){
						totalRowHtml += Math.round(groups[i].avg()*100)/100;
					}
					totalRowHtml += '</td>';
			}
			totalRowHtml += '</tr>';
			$('tr:last',table).after(totalRowHtml);
			
			return;
		}//End Func. rowAgr()
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		