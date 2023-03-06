<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select-Service Midterm 2</title>
    <body>
                <fieldset>
                <label for="shows">User:</label>
                <select name="shows" id="shows">
                    <?php
                    // connect
                    $db = new PDO('mysql:host=172.31.22.43;dbname=Michele200532651', 'Michele200532651', 'I2FPuA0WV2');
//EVERYTHING IS WORKING HERE BUT MY CONNECTION - I DON'T KNOW WHAT IS WRONG WITH IT
                    // use SELECT to fetch the shows
                    $sql = "SELECT * FROM shows";

                    // run the query
                    $cmd = $db->prepare($sql);
                    $cmd->execute();
                    $shows = $cmd->fetchAll();
                    // loop through the user data to create a list item for each
                    foreach ($shows as $show) {
                        echo '<option>' . $show['email'] . '</option>';
                    }

                    // disconnect
                    $db = null;
                    ?>
                </select>
                </body>
                </html>
