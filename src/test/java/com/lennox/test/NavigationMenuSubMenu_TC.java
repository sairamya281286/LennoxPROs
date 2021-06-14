package com.lennox.test;

import java.io.IOException;
import java.util.Map;

import org.testng.Assert;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import com.lennox.functionallibrary.Baseclass;
import com.lennox.functionallibrary.GetexcelData;
import com.lennox.pageobjects.HomePage;
import com.lennox.pageobjects.searchProduct;


public class NavigationMenuSubMenu_TC extends Baseclass {
	
	LoginPage_TC lpt=new LoginPage_TC();
	String path=System.getProperty("user.dir")+"/src/test/java/com/lennox/testdata/TestData.xlsx";




	@Test(dataProvider ="Menu")
	public void selectmenu(String menu,String submenu,String productName,String pageNavigation, String page_desc,String model,String price) throws InterruptedException, IOException
	{
		HomePage hp=new HomePage(driver);
		lpt.verifyLogin();
		hp.selectMainmenu(menu);
		logger.info("Main menu selected successfully");
		hp.selectsubmenu(submenu);
		logger.info("Sub menu selected successfully");
		hp.selectShopBy(pageNavigation);
		logger.info("Page Navigation done successfully");

		
		 if(driver.getPageSource().contains(page_desc)) {
		 Assert.assertTrue(true); 
		 logger.info("Navigation test passed");
		 searchProduct sp=new searchProduct(driver);
		 Map<String, String> map = sp.search_Product(productName);
		 boolean validate_productDetails = sp.validate_productDetails();
		 System.out.println(validate_productDetails);
		 if(map.get("Model Part#").contains(model)&& map.get("Price").contains(price) && sp.validate_productDetails()==true)
		 {
			 Assert.assertTrue(true); 
			 logger.info("Product Details test passed");
 		 } 

		  }
								
		 		 
		  else { 
			  try {
				  captureScreen(driver,"Navigation_TC"); 
		  } catch (IOException e) {
			  e.printStackTrace();
			}
		 Assert.assertTrue(false);
		logger.info("Navigation test failed"); 
		
		
		}}
	
	
	@DataProvider(name="Menu")
	String [][] getData() throws IOException
	{
		
		int rownum=GetexcelData.getRowCount(path, "Sheet1");
		int colcount=GetexcelData.getCellCount(path,"Sheet1",1);
		System.out.println("Row co:"+rownum);
				
		String menu_submenu[][]=new String[rownum][colcount];
		
			for(int i=1;i<=rownum;i++) {
				for(int j=0;j<colcount;j++) {
				menu_submenu[i-1][j]=GetexcelData.getCellData(path,"Sheet1", i,j);
				}
			}
			
	return menu_submenu;
	}
	
	
	
}
