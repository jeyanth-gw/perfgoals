/**
 * 
 */
package com.org.rest.goals;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import com.org.constants.ConstantsUtil;

import sun.misc.BASE64Encoder;

/**
 * @author ajan.rengarajan
 *
 */
@Path("/names")
public class EmployeeDataService {

	
	/** Send image from server to client
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("/image")
	@Produces(MediaType.APPLICATION_JSON)
	public String getImg() throws IOException {
		
		BufferedImage img = ImageIO.read(new File(ConstantsUtil.IMAGE_FILE_PATH)); 
        BufferedImage image=img;
		String type="png";
		String imageString = "";
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ImageIO.write(image, type, bos);
            byte[] imageBytes = bos.toByteArray();
            BASE64Encoder encoder = new BASE64Encoder();
            imageString =imageString+ encoder.encode(imageBytes)+"";
            imageString="\""+imageString.trim()+"\"";
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(imageString.trim());
        return(imageString.replaceAll("[\n\r]", ""));
 
	}
	
	/** Get the file and upload it to server location
	 * @param fileInputStream
	 * @param fileFormDataContentDisposition
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("/upload") 
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadExcelFile(
            @FormDataParam("uploadFiles") InputStream fileInputStream,
            @FormDataParam("uploadFiles") FormDataContentDisposition fileFormDataContentDisposition) throws IOException {
 
        	String fileName = null;
 
            fileName = fileFormDataContentDisposition.getFileName();
            writeToFileServer(fileInputStream, fileName);
            return readProjectGoals();
    }
	
	/**
     * write input stream to file server
     * @param inputStream
     * @param fileName
     * @throws IOException
     */
    private String writeToFileServer(InputStream inputStream, String fileName) throws IOException {
 
        OutputStream outputStream = null;
        String qualifiedUploadFilePath = ConstantsUtil.UPLOAD_FILE_SERVER + fileName;
 
        try {
            outputStream = new FileOutputStream(new File(qualifiedUploadFilePath));
            int read = 0;
            byte[] bytes = new byte[1024];
            while ((read = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
            outputStream.flush();
            
        }
        catch (IOException ioe) {
            ioe.printStackTrace();
        }
        finally{
            outputStream.close();
        }
        return qualifiedUploadFilePath;
    }
    
    /** Read goal sheet and return response
     * @param inputFile
     * @param goals
     * @param end
     * @throws IOException
     */
    public String readGoalSheet(String inputFile, String goals, int end) throws IOException  {
	    File inputWorkbook = new File(inputFile);
	    Workbook w;
	    StringBuffer sBuffer = new StringBuffer("");
	    try {
	      w = Workbook.getWorkbook(inputWorkbook);
	      Sheet sheet = w.getSheet(0);
	      
	      if(ConstantsUtil.EVALUATION.equals(goals)){
	    	  Cell finalRating = sheet.getCell(9,26);
	    	  sBuffer.append(finalRating.getContents()+"~");
        	  sBuffer = findString(28,1,sBuffer,end,sheet);
        	sBuffer.deleteCharAt(sBuffer.lastIndexOf("~")); 
          }else{
        	  for (int j = 0; j < sheet.getColumns(); j++) {
      	        for (int i = 0; i < sheet.getRows(); i++) {
      	          Cell cell = sheet.getCell(j, i);
      	          
      	          if(cell.getContents().contains(goals)){
      	        	sBuffer = findString(i,j,sBuffer,end,sheet);
      	        	sBuffer.deleteCharAt(sBuffer.lastIndexOf("~")); 
      	          }
      	        }
      	      }
          }
	      
	      return (constructJson(sBuffer.toString().replaceAll("[\n\r]", "^")));
	    } catch (BiffException e) {
	      e.printStackTrace();
	      return constructJson(sBuffer.toString());
	    }
	  }
    
    /** Convert to json string
     * @param information
     * @return
     */
    private String constructJson(String information){
    	String[] informationArray = information.split("~");
		StringBuffer json = new StringBuffer("");
		int incrementor=0;
		json.append("{");
		for (String info : informationArray) {
			incrementor++;
			json.append("\""+incrementor+"\""+":\""+info+"\",");
		}
		json.deleteCharAt(json.lastIndexOf(","));
		json.append("}");
		return json.toString();
    }
	
	@GET
	@Path("/getResume/{employeeId}")
	@Produces("application/vnd.ms-excel")
	public Response getFile(@PathParam("employeeId") String empId) {
		
		File file = new File(ConstantsUtil.FILE_PATH);
		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition",
			"attachment; filename="+empId+"_Resume.xls");
		return response.build();
 
	}
	
	/** To populate data based on tabs selected.
	 * @param tab
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("goals/{tabName}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getGoals(@PathParam("tabName") String tab) throws IOException{
		
	if(ConstantsUtil.PROJ_GOALS.equalsIgnoreCase(tab)){
			return readProjectGoals();
		}
	else if(ConstantsUtil.UTIL_GOAL.equalsIgnoreCase(tab)){
		return readUtilizationGoals();
	}
	else{
			if(!ConstantsUtil.EVALUATION.equalsIgnoreCase(tab)){
				return readGoalSheet(ConstantsUtil.FILE_PATH,tab,ConstantsUtil.REST);
			}
			return readGoalSheet(ConstantsUtil.FILE_PATH,tab,ConstantsUtil.EVAL);
		}
		}
	
	@GET
	@Path("contribution")
	@Produces(MediaType.APPLICATION_JSON)
	public String getContribution() throws IOException, ParseException{
		
		SimpleDateFormat myFormat = new SimpleDateFormat("dd MM yyyy");
		String inputString1 = "12 10 2012";
		String inputString2 = "12 10 2014";
		String inputString3 = "12 10 2014";

		    Date date1 = myFormat.parse(inputString1);
		    Date date2 = myFormat.parse(inputString2);
		    Date date3 = myFormat.parse(inputString3);
		    Date date4 = new Date();
		    long diff1 = date2.getTime() - date1.getTime();
		    long diff2 = date4.getTime() - date3.getTime();
		    long tot = TimeUnit.DAYS.convert(diff1, TimeUnit.MILLISECONDS) + (TimeUnit.DAYS.convert(diff2, TimeUnit.MILLISECONDS));
		    float nonBillable = diff1/tot;
		    float billable= diff2/tot;
		    String contributionJson= "{\"billable\": { \"name\": \"DTCC\", \"startDate\": \"12-10-14\",\"endDate\": \"Till Date\",\"value\":"+billable+"},\"nonBillable\": {\"startDate\": \"12-10-12\",\"endDate\": \"12-10-14\",\"value\":"+nonBillable+" }}";
	return contributionJson;
		}
		
	
	/** Method to read project goals.
	 * @throws IOException
	 */
	public String readProjectGoals() throws IOException  {
	    File inputWorkbook = new File(ConstantsUtil.FILE_PATH);
	    Workbook w;
	    try {
	      w = Workbook.getWorkbook(inputWorkbook);
	      Sheet sheet = w.getSheet(1);
	      StringBuffer sBuffer = new StringBuffer("");
	     
	        	  for(int y=4;y<sheet.getRows();y=y+5){
		        	if(!"".equals(sheet.getCell(1,y).getContents())){
		        		ConstantsUtil.TEMP= y;
		        	}else{
	        			  break;
	        		  }
	        	  }
	        	  for(int k=3;k<ConstantsUtil.TEMP+4;k++) {
	        		  for(int z=1;z<9;z++){
	        			  Cell cellNext = sheet.getCell(z,k);
	        			  if(!"".equalsIgnoreCase(cellNext.getContents())){
	        				  
	        				  sBuffer.append(cellNext.getContents()+"~");
	        			  }
	        		  }
	        		 }
	        	sBuffer.deleteCharAt(sBuffer.lastIndexOf("~")); 
	        	System.out.println(sBuffer.toString());
	        	return (constructJson(sBuffer.toString().replaceAll("[\n\r]", "^")));
	    } catch (BiffException e) {
	      e.printStackTrace();
	    }
	    return "";
	  }
	
	/** To read utilization goals.
	 * @return
	 * @throws IOException
	 */
	public String readUtilizationGoals() throws IOException{
		    File inputWorkbook = new File(ConstantsUtil.FILE_PATH);
		    Workbook w;
		    StringBuffer sBuffer = new StringBuffer("");
		    try {
		      w = Workbook.getWorkbook(inputWorkbook);
		      Sheet sheet = w.getSheet(1);
		     
		        	  for(int y=3;y<sheet.getRows();y=y+5){
			        	if(!(sheet.getCell(10,y).getContents()).contains(ConstantsUtil.PROJ_NAME)){
			        		ConstantsUtil.TEMP= y;
			        	}else{
		        			  break;
		        		  }
		        	  }
		        	  for(int k=3;k<ConstantsUtil.TEMP+4;k++) {
		        		  for(int z=9;z<sheet.getColumns();z++){
		        			  Cell cellNext = sheet.getCell(z,k);
		        			  if(!"".equalsIgnoreCase(cellNext.getContents())){
		        				  sBuffer.append(cellNext.getContents()+"~");
		        			  }
		        		  }
		        		 }
		        	sBuffer.deleteCharAt(sBuffer.lastIndexOf("~")); 
		    } catch (BiffException e) {
		      e.printStackTrace();
		    }
		    return (constructJson(sBuffer.toString().replaceAll("[\n\r]", "^")));
	}
	
	/** Method which returns JSON for PTO calculation.
	 * @return json
	 */
	@GET
	@Path("ptoDetails")
	@Produces(MediaType.APPLICATION_JSON)
	public String fetchPTODetails() {
		String output = "{\"totalLeavesTaken\": \"5\",\"leaveDates\":{\"1\": \"04/05/2015\",\"2\": \"05/05/2015\",\"3\": \"05/04/2015\",\"4\": \"06/12/2014\",\"5\": \"07/12/2014\"},\"leaveChartValues\":[{ \"May\": 2},{ \"Apr\": 1},{ \"Dec\": 5}]}";
		return output;
	}
	
	/** Method to accept notes form data elements.
	 * @param notesFormData
	 * @return
	 */
	@POST
	@Path("updateNotes/{employeeId}")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String updateNotesData(@PathParam("employeeId") String Id,MultivaluedMap<String, String> form){
		System.out.println("Notes Form:::::::"+form);
		System.out.println("Notes Form:::::::"+Id);
		return "";
//		return "[{\"notesDate1\": \"05/07/2015\",\"text1\": \"Howdy!! Helloo!!\",\"feel1\": 3},{\"notesDate2\": \"05/18/2015\",\"text2\": \"Howdy!!\",\"feel2\": 4}]";
	}
	
	/** Method to fetch notes details.
	 * @return json
	 */
	@GET
	@Path("getNotes/{employeeId}")
	@Produces(MediaType.APPLICATION_JSON) 
	public String fetchNotesData(){
		return "[{\"notesDate1\": \"05/07/2015\",\"text1\": \"Howdy!! Helloo!!\",\"feel1\": 3},{\"notesDate2\": \"05/18/2015\",\"text2\": \"Howdy!!\",\"feel2\": 4}]";
	}
	
	/**Method to fetch employee list
	 * @return
	 */
	@GET
	@Path("getEmployeeList")
	@Produces(MediaType.APPLICATION_JSON)
	public String getEmployeeList(){
		String json = "[{\"id\": 1,\"name\": \"Ajan\",\"image\":\"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\",\"designation\": \"AssociateTechnicalConsultant\",\"projectDetails\": ["+
            "{\"name\": \"ABC\",\"startDate\": \"12-06-2014\",\"endDate\": \"12-07-2014\"},{\"name\": \"DEF\",\"startDate\": \"12-07-2014\","+
                "\"endDate\": \"TillDate\"}],\"supervisor\": \"Harsha\",\"joiningDate\": \"12-06-2014\"}]";
		return json;
	}
	
	@GET
	@Path("getPrevYearsGoal")
	@Produces(MediaType.APPLICATION_JSON)
	public String getPrevYrsGoal(){
		String json = "{\"Rating\": [{\"year\": \"2008\",\"Comm\": \"Okay\",\"Rating\": \"3\"},{\"year\": \"2009\",\"Comm\": \"Good\","+
            "\"Rating\": \"4\"},{\"year\": \"2010\",\"Comm\": \"Excellent\",\"Rating\": \"5\"},{\"year\": \"2011\",\"Comm\": \"Okay\","+
            "\"Rating\": \"3\"},{\"year\": \"2012\",\"Comm\": \"Good\",\"Rating\": \"4\"},{\"year\": \"2013\",\"Comm\": \"Okay\",\"Rating\": \"3\""+
       "},{\"year\": \"2014\",\"Comm\": \"Excellent\",\"Rating\": \"5\"},{\"year\": \"2015\",\"Comm\": \"Good\",\"Rating\": \"4\"}]}";
		return json;
	}
	
	/** To find the row and column content based on passed query
	 * @param rowValue
	 * @param colValue
	 * @param sBuffer
	 * @param end
	 * @param sheet
	 * @return
	 */
	private StringBuffer findString(int rowValue, int colValue, StringBuffer sBuffer, int end,Sheet sheet){
		for(int k=rowValue+1;k<rowValue+end;k++) {
   		 for(int z=colValue;z<=10;z++) {
   			  Cell cellNext = sheet.getCell(z,k);
   			  if(!"".equalsIgnoreCase(cellNext.getContents())){
   				  sBuffer.append(cellNext.getContents()+"~");
   			  }
   	  }
   	  sBuffer.deleteCharAt(sBuffer.lastIndexOf("~"));
   	  sBuffer.append("~");
   	 }
		return sBuffer;
	}
}
