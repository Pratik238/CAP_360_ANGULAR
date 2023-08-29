<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- Get Admission strip -->
<div class="call-action bg-primary">
	<div class="cta-block">
		<div class="container">
			<div class="content">
				<div class="cta-sameline">
					<h3>ENROLL YOUR CHILD FOR 2020-2021 </h3>
					<p>Join the CAP center program. Enroll your child in the 2020-2021 batch.</p>
					<a class="btn btn-outline" href="<c:url value='/admissionForm' />"> <i class="fa fa-graduation-cap"></i> Get Admission</a>
				</div>
			</div>
		</div>
	</div>	
</div>
<!-- Get Admission strip End -->
<div class="footer">
  <div class="f-bg-cap">
    <div class="container">
    <div class="row">
      <div class="col-sm-6 col-md-3 cap_footer_grid">
        <h2><span>Programs</span></h2>
        <ul class="cap_footer_nav">
       		<li><a href="<c:url value='/freshmanProgram' />">Freshman Program</a></li>
			<li><a href="<c:url value='/sophomoreProgram' />">Sophomore Program </a></li>
			<li><a href="<c:url value='/juniorProgram' />">Junior Program </a></li>
			<li><a href="<c:url value='/seniorProgram' />">Senior Program </a></li>
			<li><a href="<c:url value='/capHighlights' />">CAP Highlights </a></li>
			<li><a href="<c:url value='/pricing' />">Pricing </a></li>
        </ul>
      </div>
      <div class="col-sm-6 col-md-3 cap_footer_grid">
        <h2><span>More about CAP</span></h2>
        <ul class="cap_footer_nav">
          <li><a href="<c:url value='/reasonsToJoinCap' />">5 Reasons to join CAP </a></li>
          <li><a href="<c:url value='/increaseSatActScores' />">Increase SAT/ACT Scores </a></li>
          <li><a href="<c:url value='/essayWriting' />">Essay Writing </a></li>
          <li><a href="<c:url value='/topJobsOf2025' />">Top jobs of 2025</a></li>
          <li><a href="<c:url value='/targetIVY' />">Target-IVY</a></li>
          <li><a href="<c:url value='/signUpForm' />">Sign Up</a></li>
         </ul>
      </div>
      <!-- Microdata  -->
      <div itemtype="http://schema.org/PostalAddress" itemscope="" itemprop="address">
      <div class="col-sm-6 col-md-3 cap_footer_grid">
        <h2><span>CONTACT US</span></h2>
        <p><i class="fa fa-home"></i> : <span itemprop="streetAddress">44200 Waxpool Road,<br>Suite # 187 </span>,<span itemprop="addressLocality">Ashburn</span>,<span itemprop="addressRegion">VA</span>-<span itemprop="postalCode">20147</span>.<br>
          <i class="fa fa-phone"></i> :  <span itemprop="telephone"> +1 571-279-0000 </span> <br>
          <i class="fa fa-envelope"></i> : <span itemprop="email"> contact@cap.center </span></p>
        <ul class="social_capinfo">
          <li><a href="#" class="w3_facebook" itemprop="sameAs"><i class="fa fa-facebook"></i></a></li>
          <li><a href="https://twitter.com/capivyleague" target="_blank" class="w3_twitter" itemprop="sameAs"><i class="fa fa-twitter"></i></a></li>
          <li><a href="#" class="w3_instagram" itemprop="sameAs"><i class="fa fa-instagram"></i></a></li>
          <!-- <li><a href="#" class="w3_google" itemprop="sameAs"><i class="fa fa-google-plus"></i></a></li> -->
        </ul>
      </div>
      </div>
      <!-- End -->
      <div class="col-sm-6 col-md-3 cap_footer_grid">
        <h2> <span>SUBSCRIBE TO NEWSLETTERS </span></h2>
        <p>Join our subscription list. Get all the latest updates on programs, sessions and more in your inbox.</p>
        <form action="#" method="post">
          <input type="email" name="Email" placeholder="Email Id" required>
          <input type="submit" value="">
        </form>
      </div>
    </div>
    </div>
  </div>
  <div class="foot-copy-right">
  <div class="container">
  <div class="row copy-right">
  <div class="col-md-6 col-sm-6">
     <p>Copyright &copy; 2020 <a href="https://cap.center/" class="clr-red" itemprop="url">CAP</a>. All rights reserved. </p>
   </div>
  <div class="col-md-6 col-sm-6">
   <ul class="right-align">
   <li><a href="<c:url value='/capFaq' />">FAQ</a><span>|</span></li>
   <li><a href="<c:url value='/privacyPolicy' />">Privacy Policy</a><span>|</span></li> 
   <li><a href="<c:url value='/termsAndConditions' />">Terms and Conditions</a></li>
   </ul>
   </div>
  </div>
   </div>
  </div>
</div>
<script src="<c:url value='/static/js/jquery-2.1.4.min.js' />"></script> 
<script src="<c:url value='/static/js/bootstrap.js' />"></script>
<script src="<c:url value='/static/js/custom.js' />"></script> 
<script src="https://s7.addthis.com/js/300/addthis_widget.js' />" async="async"></script>
<script src="<c:url value='/static/js/admin.js' />"></script> 
<script src="<c:url value='/static/js/user.js' />"></script>
<script src="<c:url value='/static/cap-js/new-script.js' />"></script> 
<script src="<c:url value='/static/cap-js/new-core-min.js' />"></script> 
<script src="<c:url value='/static/cap-js/new-slick.min.js' />"></script> 
<script>$(document).ready(function() {$().UItoTop({ easingType: 'easeOutQuart' });});</script>
<script>$('.close').on('click', function () {$('#cap-week-toper-popup').hide();}); setTimeout(function() {$('#cap-week-toper-popup').fadeOut('slow');}, 8000);</script> 
<script>
		$(window).load(function(){
		 $('#JiSlider').JiSlider({color: '#fff', start: 3, reverse: true}).addClass('ff')
		  $('.flexslider').flexslider({
			animation: "slide",
			start: function(slider){
			  $('body').removeClass('loading');
			}
		  });
		});
		$('.counter').countUp();	
</script>
<script>
window.onscroll = function() {myFunction()};
var header = document.getElementById("myHeader");
var sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
</script>
<!-- Left Nav Hide and Show -->
<script>
function reasons(evt, resonName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(resonName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();
</script>
<!-- End -->
<script>
$(window).load(function(){
	  $(".preload").fadeOut(1500, function() {
	  $(".banner-slides").fadeIn(1000); 
	  });
});	
</script> 
<script>
$(document).ready(function() {
  $("#find_program").click(function(){
     var go_to_url = $("#programs").find(":selected").val();
     document.location.href = go_to_url;
   });
});
</script>
<script>
$(document).ready(function(){
$('#parentBlock').hide();
$("input[name='applyType']").click(function () {
    if ($("#parent").is(":checked")) {
        $("#parentBlock").show();
    } else {
        $("#parentBlock").hide();
    }
});
$('#studentBlock').hide();
$("input[name='applyType']").click(function () {
    if ($("#student").is(":checked")) {
        $("#studentBlock").show();
    } else {
        $("#studentBlock").hide();
    }
});
});
var ctx = "${pageContext.request.contextPath}"
</script>
<div class="alert alert-success-empty" id="loading">
	<img src="<c:url value='/static/images/loading-icon.gif' />" alt="loading" class="loading-icon" />
</div>
<div class="alert alert-success-empty fade" id="success">
<div class="alert-text">
  	<button type="button" class="close" onclick="$('#sMsg').html(''); $('#success').hide()">×</button>
  	<div id="sMsg"></div>
</div>
</div>
<div class="alert alert-danger-empty fade" id="failure">
	<div class="alert-text">
  	<button type="button" class="close" onclick="$('#eMsg').html(''); $('#failure').hide()">×</button>
  	<div id="eMsg"></div>
  	</div>
</div>
<c:if test="errorMsg!=null && !errorMsg.equals('')">
<script type="text/javascript">showError('<s:property value="errorMsg"/>');</script>
</c:if> 
<c:if test="msg!=null && !msg.equals('')">
<script type="text/javascript">showSucess('<s:property value="msg"/>');</script>
</c:if>
</div>