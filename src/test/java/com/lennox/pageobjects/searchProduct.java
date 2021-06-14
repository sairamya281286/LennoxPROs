package com.lennox.pageobjects;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.lennox.functionallibrary.Baseclass;

public class searchProduct extends Baseclass {

	Map<String,String> m=new HashMap<String,String>();

	WebDriver driver;
	String text=null;
	public searchProduct(WebDriver rdriver)
	{
		driver=rdriver;
		PageFactory.initElements(driver, this);

	}

	@FindBy(xpath="//div[@class='sku']")
	List<WebElement> productID;

	@FindBy(xpath="//li[@class='next']/a[@class='next icon icon-arrow-right']")
	WebElement pageIterator;

	@FindBy(xpath="//li[@class='active']")
	WebElement activePage;
	
	@FindBy(xpath="//h1[@itemprop='name']")
	WebElement productDescription;
	
	@FindBy(xpath="//p[@class='sku']/span[1]")
	WebElement productNo;
	
	@FindBy(xpath="//p[@class='sku']/span[3]")
	WebElement modelNo;
	
	@FindBy(xpath="//p[@class='price']/strong/span")
	WebElement yourPrice;
	
	@FindBy(xpath="//p[@class='price']")
	WebElement listPrice;
	
	@FindBy(xpath="//label[text()='Standard Shipping ']/span")
	WebElement standardShipping;
	
	@FindBy(xpath="//div[@class='availability-info-ot']/strong")
	WebElement pickUpInStore;
	
	@FindBy(xpath="//span[@class='zip-replace']")
	WebElement postalCode;
	
	


	public Map<String,String> search_Product(String ID) throws InterruptedException
	{
		String flag="Disabled";
		try {
			while(activePage.isDisplayed() )	{
				for (WebElement webElement : productID) {
					text=webElement.getText();
					if(text.contains(ID)) {
						System.out.println("Product located:"+text);
						WebElement addtoCart=driver.findElement(By.xpath("//li[@data-product-id='"+ID+"']"));
						if(addtoCart.isEnabled()) {
							flag="Enabled";

						}
						m.put("Description","Bristol H22J38BABC, Reciprocating Compressor, 37,800 Btuh 208/230V, R-22, 1 Phase");
						m.put("Model Part#", "H22J38BABC");
						m.put("Cat#", "10T46");
						m.put("Price","$1173.00");
						m.put("List Price", "$2697.90");
						m.put("Standard Shipping","In Stock");
						m.put("Pick Up in Store","This item is not available from a location in your area. Please call 1-877-570-0123");
						m.put("Postal code", "36105-6205");
						m.put("Add to Cart", flag);
						jsClick(webElement);
						Thread.sleep(5000);
						break;}}
						if(text.contains(ID))
							break;							
						scrolldown(); Thread.sleep(5000); 
				if(pageIterator.isDisplayed()) {
					jsClick(pageIterator); 
					Thread.sleep(5000);
				}
				else
					break;
			}
		}	

		catch (Exception e) {
			e.printStackTrace();
		}
		return m;


	}
	
	public boolean validate_productDetails()
	
	{ 
		Assert.assertTrue(productDescription.getText().contains(m.get("Description")));	
		Assert.assertTrue(modelNo.getText().contains(m.get("Model Part#")));
		Assert.assertTrue(productNo.getText().contains(m.get("Cat#")));	
		Assert.assertTrue(yourPrice.getText().contains(m.get("Price")));
		Assert.assertTrue(listPrice.getText().contains(m.get("List Price")));
		Assert.assertTrue(standardShipping.getText().contains(m.get("Standard Shipping")));	
		Assert.assertTrue(pickUpInStore.getText().contains(m.get("Pick Up in Store")));
		Assert.assertTrue(postalCode.getText().contains(m.get("Postal code")));
		return true;		

	}
	
}


