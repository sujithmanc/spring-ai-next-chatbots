db.selectDistinct({
  topic: qaNotes.topic,
}).from(qaNotes);

db.selectDistinct({
  date: qaNotes.date,
})
  .from(qaNotes)
  .orderBy(qaNotes.date);

db.select({
  date: qaNotes.date,
  count: sql`count(*)`.as("count"),
})
  .from(qaNotes)
  .groupBy(qaNotes.date)
  .orderBy(sql`${qaNotes.date} desc`);

db.select({
  topic: qaNotes.topic,
  count: sql`count(*)`.as("count"),
})
  .from(qaNotes)
  .groupBy(qaNotes.topic)
  .orderBy(sql`${qaNotes.date} desc`);

db.select({
  topic: qaNotes.topic,
  date: qaNotes.date,
  count: sql`count(*)`.as("count"),
})
  .from(qaNotes)
  .groupBy(qaNotes.topic, qaNotes.date)
  .orderBy(sql`${qaNotes.date} desc`);

db.selectDistinct({
  topic: qaNotes.topic,
})
  .from(qaNotes)
  .where(eq(qaNotes.date, "2026-03-20"));


db.select()
  .from(qaNotes)
  .where(and(eq(qaNotes.date, "2026-03-20"), inArray(qaNotes.topic, ["17"])))
  .orderBy(qaNotes.id);

db.select()
  .from(qaNotes)
  .where(and(eq(qaNotes.date, "2026-03-20"), undefined))
  .orderBy(qaNotes.id);