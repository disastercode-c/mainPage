
<?php
//action.php
if(isset($_POST["action"]))
{
 $connect = mysqli_connect("localhost", "root", "patrol2020smart", "patrol");
 if($_POST["action"] == "fetch")
 {
  $query = "SELECT * FROM historico ORDER BY id DESC";
  $result = mysqli_query($connect, $query);
  $output = '
   <table class="table table-bordered table-striped">  
    <tr>
     <th width="5%">ID</th>
     <th width="40%">Image</th>
     <th width="25%">Fecha</th>
     <th width="30%">Nombre</th>
     
    </tr>
  ';
  while($row = mysqli_fetch_array($result))
  {
   $output .= '

    <tr>
     <td style="text-align: center; vertical-align: middle;">'.$row["id"].'</td>
     <td style="text-align: center; vertical-align: middle;">
      <img src="data:image/jpeg;base64,'.base64_encode($row['foto'] ).'" height="120" width="150" class="img-thumbnail" />
     </td>
     <td style="text-align: center; vertical-align: middle;">'.$row["fecha"].'</td>
     <td style="text-align: center; vertical-align: middle;">'.$row["nombre"].'</td>
     
    </tr>
   ';
  }
  $output .= '</table>';
  echo $output;
 }

 if($_POST["action"] == "insert")
 {
  $file = addslashes(file_get_contents($_FILES["image"]["tmp_name"]));
  $query = "INSERT INTO tbl_images(name) VALUES ('$file')";
  if(mysqli_query($connect, $query))
  {
   echo 'Image Inserted into Database';
  }
 }
 if($_POST["action"] == "update")
 {
  $file = addslashes(file_get_contents($_FILES["image"]["tmp_name"]));
  $query = "UPDATE tbl_images SET name = '$file' WHERE id = '".$_POST["image_id"]."'";
  if(mysqli_query($connect, $query))
  {
   echo 'Image Updated into Database';
  }
 }
 if($_POST["action"] == "delete")
 {
  $query = "DELETE FROM tbl_images WHERE id = '".$_POST["image_id"]."'";
  if(mysqli_query($connect, $query))
  {
   echo 'Image Deleted from Database';
  }
 }
}
?>
