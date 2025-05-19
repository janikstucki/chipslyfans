async function updateUserTagInterests(userId, tags) {
  for (const tag of tags) {
    const [entry, created] = await UserTagInterest.findOrCreate({
      where: { userId, tag },
      defaults: { weight: 1 }
    });

    if (!created) {
      entry.weight += 1;
      await entry.save();
    }
  }
}