$("#unlogged_content").hide()
$("#logged_content").hide()

let token = localStorage.getItem('token')
$(document).ready(function(){  
  if (token != null){
    $("#logged_content").show()
  }
  else{
    $("#unlogged_content").show()
  }
})

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ready-mode/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'dolllls';
const image = document.querySelector('#fileupload');

let uploadedFileUrl
image.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then((data) => {
    if (data.secure_url !== '') 
    {  
      uploadedFileUrl = data.secure_url;
      ///localStorage.setItem('passportUrl', uploadedFileUrl);
      console.log(uploadedFileUrl)
      $('#hold').attr("src", uploadedFileUrl);
    }
  })
  .catch(err => console.error(err));
});

function upload_doll(){
  let n= document.getElementById('doll_name').value
  let a = document.getElementById('doll_attribute').value

  //let t = $('input[name=r_type]:checked').val()

  let body = {
    doll_name: n,
    doll_attribute: a,
    doll_img: uploadedFileUrl
  }
  //console.log(body)
  
  let url = 'http://readymode.pythonanywhere.com/upload/doll'
  let h = new Headers()
  h.append('Accept','application/json')
  h.append('Content-type', 'application/json')
  h.append('client-token', `${token}`)
  let req = new Request(url,{
    method:'POST',
    headers:h,
    body:JSON.stringify(body),
    mode:'cors',
  })

  fetch(req)
  .then(response=>{
    if(response.ok) {
      return response.json();
      } else {
      throw new Error();
      }
  })
  .then((data)=>{
    console.log(data)
    $("#logged_content").hide()
    $('body').append(`
      <div id="unlogged_content" class="container text-center">
        <div class="row">
          <div class="mx-auto col-10">
            <h4>???????????????</h4>
            <p>${data.back}</p>
            <a class="btn btn-primary" href="home.html">??????</a>
          </div>
        </div>
      </div>
    `)
  })
  .catch((err)=>{
    console.log('Erro', err.massage);
    alert('Erro', err.massage)
  })
}
