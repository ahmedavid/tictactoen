import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Main {

    public static void main(String[] args) {
        //Game game = new Game(3, (byte)1);

        //BaseResponse response = ApiHelper.CreateGame(1243, 1246, 20, 10);
        BaseResponse response = ApiHelper.GetMyGames();

        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(response.ResponseBody, JsonObject.class);

        JsonArray myGames = jsonObject.get("myGames").getAsJsonArray();
        for (var game : myGames)
        {
            System.out.println("Game: "+game+"\n");
        }

        System.out.println(response.ResponseBody);
    }
}