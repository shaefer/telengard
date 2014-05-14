describe("Monsters", function() {
  it("should be able to construct all monsters", function() {
    BuildAllMonsters();
    var monsterKeys = Object.keys(Monsters);
    for (var i = 0; i<monsterKeys.length;i++)
    {
      var key = monsterKeys[i];
      var monsterFunc = Monsters[key].constructor;
      try
      {
        var monster = new monsterFunc(1, "");
        expect(monster).toBeTruthy();
      }
      catch(ex)
      {
        expect("Caught exception while constructing: " + key).toBe(false);
      }
    }
  });
});
