//disable submit khi chưa có gì
//document.querySelector('#submit').setAttribute('disabled',true);
//Đối tượng Validator 
function Validator(options) {
	//how to nhận nhiều rule
	var selectorRules = {};
	//hàm valide input
	function validate(inputElement, rule) {
		var errorMess;
		var errorElement = inputElement.parentElement.querySelector('.form-message');
		//lấy ra các rule của selector
		var rules = selectorRules[rule.selector];
		//lặp qua từng rule và kiểm tra
		//nếu có lỗi thì dừng ktra
		for (var i = 0; i < rules.length; ++i) {
			errorMess = rules[i](inputElement.value);
			if (errorMess) break;			
		}

		if (errorMess) {
			errorElement.innerText = errorMess;
			inputElement.parentElement.classList.add('invalid');
		} else {
			errorElement.innerText = '';
			inputElement.parentElement.classList.remove('invalid');
		}
		return !errorMess;
	}
	//lấy element của form cần validate
	var formElement = document.querySelector(options.form);
	if (formElement) {
		//lặp qua rules và lắng nghe sự kiện submit
		formElement.onsubmit = function (e) {
			//khi submit form
			e.preventDefault();
			//craete flag if have error
			var isFormValid = true;
			options.rules.forEach(function (rule) {
				var inputElement = formElement.querySelector(rule.selector);
				var isValid = validate(inputElement, rule);
				if (!isValid) isFormValid = false;				
			});
			//if all input ko lỗi
			if (isFormValid) {
				//submit khi sử dụng javascript
				if (typeof options.onSubmit === 'function') {
					var enableInput = formElement.querySelectorAll('[name]:not([disable])');
					var formValue = Array.from(enableInput).reduce(function (values, input) {
						return (values[input.name] = input.value) && values;
					}, {});
					options.onSubmit(formValue);
				}//submit mặc định trình duyệt
				else formElement.submit();				
			}
		}
		options.rules.forEach(function (rule) {
			//lưu lại rule trong mỗi iput ra aray		
			if (Array.isArray(selectorRules[rule.selector])) {
				selectorRules[rule.selector].push(rule.test);
			} else {
				selectorRules[rule.selector] = [rule.test];
			}
			//
			var inputElement = formElement.querySelector(rule.selector);
			
			if (inputElement) {
				//xử lý trường hợp blur khoi input
				inputElement.onblur = function () {
					validate(inputElement, rule);
				}
				//xử lý mỗi khi người dùng nhập vào input
				inputElement.oninput = function () {
					var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
					errorElement.innerText = '';
					inputElement.parentElement.classList.remove('invalid');
				}
				//enable submit khi nhập đúng
				// var dem=0;
				// inputElement.onkeyup=function(){
				// 	if(validate(inputElement, rule)){
				// 		dem++;
				// 		console.log(dem);
				// 	}
				// 	// validate(inputElement, rule);
				// 	// console.log(validate(inputElement, rule));
				// 	// document.querySelector('#submit').removeAttribute('disabled',false); 
				// 	console.log("keyup rồi na");
				// }
		
			}
		});		
	}
}
//định nghĩa ruless
//nguyên tắc của rules
//1. khi có lỗi thì trả message lỗi
//2. hợp lệ thì trả undefine
Validator.isRequired = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return value.trim() ? undefined : 'Vui lòng nhập trường này';
		}
	}
}
//kiểm tra định dạng email
Validator.isEmail = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : 'Trường này phải là email';
		}
	}
}
//kiểm tra độ dài tối thiểu
Validator.minLength = function (selector, min) {
	return{
		selector:selector,
		test: function (value){
			return value.length >= min ? undefined : `Bạn cần nhập tối thiếu ${min} kí tự`;
		}
	}
}
//kiểm tra độ dài tối đa
Validator.maxLength = function (selector, max) {
	return{
		selector:selector,
		test: function (value){
			return value.length <= max ? undefined : `Bạn cần nhập tối đa ${max} kí tự`;
		}
	}
}
//kiểm tra đã trung mật khẩu chưa
Validator.isConfirm = function (selector, getConfirmValue, mess) {
	return {
		selector: selector,
		test: function (value) {
			return value === getConfirmValue() ? undefined : mess || `Mật khẩu xác nhận không chính xác`;
		}
	}
}
//kiểm tra có chữ in hoa ko
Validator.isContainUpperCase = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return value.trim().match(".*[A-Z].*") ? undefined : "Vui lòng nhập vào chữ in hoa";
		}
	}
}
//kiểm tra có chữ in thường ko
Validator.isContainLowerCase = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return value.match(".*[a-z].*") ? undefined : "Vui lòng nhập vào chữ in thường";
		}
	}
}
//kiểm tra có kí tự đặc biệt ko
Validator.isSpecialChar = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return !value.match(".*\\d.*") ? undefined : "Vui lòng không nhập kí tự đặc biệt";
		}
	}
}
//bay h chua can thiet
Validator.isSpace = function (selector) {
	return {
		selector: selector,
		test: function (value) {
			return !value.match(".*[~!.......].*") ? undefined : "Vui lòng không nhập khoảng trống";
		}
	}
}

	//cũng chưa cần thiết kuoon
	//gõ tiếng việt
	// 	function xoa_dau(str) {
	//     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	//     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	//     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	//     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	//     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	//     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	//     str = str.replace(/đ/g, "d");
	//     str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	//     str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	//     str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	//     str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	//     str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	//     str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	//     str = str.replace(/Đ/g, "D");
	//     return str;
	// }

// window.onload = function(){
    
//     document.querySelector('#confirm').addEventListener('keyup',function(){
// 		var spanElement= document.querySelector("#confirm+span");
// 		if(spanElement.textContent == ""){
// 		console.log(1);
// 			document.querySelector('#submit').removeAttribute('disabled',false); 
// 		}           
//         else
// 			document.querySelector('#submit').setAttribute('disabled',true);
//     })
// };
