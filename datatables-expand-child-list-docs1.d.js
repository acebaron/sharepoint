<script type="text/javascript" src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>

<link  type="text/css" rel="stylesheet" href="../SiteAssets/jquery.dataTables.table.style.css" />
<link  type="text/css" rel="stylesheet" href="https://cdn.datatables.net/buttons/1.1.1/css/buttons.dataTables.min.css" />
<link  type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css" />

<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.1.1/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.1.1/js/buttons.flash.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js "></script>
<script type="text/javascript" src="https://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.1.1/js/buttons.html5.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.1.1/js/buttons.print.min.js"></script>

<script type="text/javascript">
// datatables-expand-child-list-docs 1.x 
// Render a datatables list with expandable row child list with doccuments


// Convert SharePoint's UNIX date/time format
function convertSPdate(value) {
	if (value === null) return "";
	var pattern = /Date\(([^)]+)\)/;
	var results = pattern.exec(value);
	var dt = new Date(parseFloat(results[1]));
	return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
};
	
// Expansion row formatting function with ajax call to other list
function expandRow ( d ) {
    // 'd' is the original data object for the row so we can use that to filter, for example d.SiteName
    $.ajax({
        url: "https://x.x.com/sites/9500002.bc/_vti_bin/listdata.svc/Permits?$filter=FacilityId eq "+d.Id,		
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function(data){
            $.each(data.d.results, function(index, item){
                 $('#permitlistbyfacility_'+d.Id).append('<tr>' 
                 	+ '<td>' + '<a href="../_layouts/listform.aspx?PageType=6&amp;ListId={22C3AC0E-585A-452B-A613-3ADBF309078A}&amp;ID='+item.Id+'&amp;ContentTypeID=0x010074972319F4705B46953D362D97B94AB1&Source=https://x.x.com/sites/9500002.bc/pages/facilities.aspx"><img src="/_layouts/husch/images/documents_report_sm.gif" border="0" alt="" title='+item.Permit+'>'+' '+item.Permit+'</a>'+'</td>'
                 	+ '<td>' + item.PermitNumber + '</td>'
                 	+ '<td>' + item.Location + '</td>'
                 	+ '<td>' + item.Entity + '</td>'
                 	+ '<td>' + item.IssuingAgency+ '</td>'
                 	+ '<td>' + item.Location + '</td>' 
                 	+ '<td>' + convertSPdate(item.DateIssued) + '</td>' 
                 	+ '<td>' + convertSPdate(item.DateExpired) + '</td>' 
                 	+ '<td>' + item.Location + '</td>'
                 	+ '</tr>');  
           });
        },
        error: function(error){
            alert(JSON.stringify(error));
        }
	});

 //return '<table id="permitlistbyfacility" + item.Id + "\" cellpadding="5" cellspacing="0" border="0" style="padding-left:10px;">'+
 return '<table id="permitlistbyfacility_'+d.Id+'" cellpadding="5" cellspacing="0" border="0" style="padding-left:10px;">'+
        '<tr>'+
            '<th>Type:</th>'+
            '<th>Number:</th>'+
            '<th>Title:</th>'+
            '<th>Entity Issued to:</th>'+
            '<th>Issuing Agency:</th>'+
            '<th>Agency Contact:</th>'+
            '<th>Issue Date:</th>'+
            '<th>Expiration Date:</th>'+
            '<th>Revise or Amend?</th>'+
            '</tr><tr>'+
        '</table>'+
        
        '<table id="permitnamechange" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr><td><strong>Name Change:  Permit Provision</strong></td><td>Info listed here............</td><td></td><td><strong>Ownership Change:  Permit Provision</strong></td><td>Info listed here............</td></tr>'+
        '<tr><td><strong>Name Change:  Regulatory Citation</strong></td><td>Info listed here............</td><td></td><td><strong>Ownership Change:  Regulatory Citation</strong></td><td>Info listed here............</td></tr>'+
        '<tr><td><strong>Name Change:  Regulatory Text</strong></td>'+
        '<td>Info listed here............</td></tr>'+
      
        '</table>'+
        
		'<table id="documentlistbyfacility" cellpadding="5" cellspacing="0" border="0" style="padding-left:10px;">'+
        '<tr>'+
 			'<td><strong><a href="https://x.x.com/sites/9500002.bc/Lists/Permits/AddNewPermit.aspx?fac='+
			d.Id+'&Source=https://x.x.com/sites/9500002.bc/pages/facilities.aspx">Add New Permit</a></strong></td>'+			
			'<td><strong><a href="https://x.x.com/sites/9500002.bc/Documents/Forms/AllItems.aspx?FilterField1=DocTasksCode&FilterValue1='+
        	d.SiteName+'">View all facility documents</a></strong></td>'+
           
        '</tr>'+
    '</table>';
};



var listName = "Facility";
var RootURL = "https://x.x.com/sites/9500002.bc/";
var ajaxGetUrl = RootURL + "_vti_bin/listdata.svc/" + listName;
var ajaxGetUrlDocs = "https://x.x.com/sites/9500002.bc/_vti_bin/listdata.svc/Documents";


$.getJSON(ajaxGetUrl, function (data) { 
    myData = data.d.results; 
    //datatables starts here:       
    dtTable = $('#facilities').DataTable( {
           data: myData,
           lengthChange: false,
           searching: false,
           paging: false,
           order: [1, 'asc'],
           columnDefs:[
            {  "targets": 0,
			   "className": 'details-control',
			   "orderable": false,
			   "data": null,
			   "defaultContent": ''
			},
	        { "targets": 1,
	          "data": null,
	          "render": function (data, type, full, meta ) {
	          	return '<a href="../_layouts/listform.aspx?PageType=6&amp;ListId={C2B2D4B7-B03C-4A74-BBE4-3F3D565392DE}&amp;ID='+data.Id+'&amp;ContentTypeID=0x010074972319F4705B46953D362D97B94AB1&Source=https://x.x.com/sites/9500002.bc/pages/facilities.aspx">'+data.SiteName+'</a>';
	          //return '<a href="../_layouts/listform.aspx?PageType=6&amp;ListId={C2B2D4B7-B03C-4A74-BBE4-3F3D565392DE}&amp;ID='+data.Id+'&amp;ContentTypeID=0x010074972319F4705B46953D362D97B94AB1&Source=https://x.x.com/sites/9500002.bc/pages/facilities.aspx">'+data.SiteName+' (internal#'+data.Id+')</a>';
	          }
	        },
	        { "targets": 2,
	          "data": "Country"},
	        { "targets": 3,
	          "data": "State"},
	        { "width": "35%",
	          "targets": 4,
	          "data": "Business"}
          ]  
         })
     
        $('#facilities tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dtTable.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
           // rows().every()
            row.child( expandRow (row.data()) ).show();
            tr.addClass('shown');
        }
    } );

    
    
    
 } );

</script>

<table id="facilities" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
            	<th></th>
                <th>Site Name</th>
                <th>Country</th>
                <th>State</th>
                <th>Business</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th></th>
                <th>Site Name</th>
                <th>Country</th>
                <th>State</th>
                <th>Business</th>
    
            </tr>
        </tfoot>
</table>

