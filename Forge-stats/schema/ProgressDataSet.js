cube(`ProgressDataSet`, {
  sql: `SELECT * FROM \`ZemenBank201908\`.\`ProgressDataSet\``,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [classname, id]
    }
  },
  
  dimensions: {
    start: {
      sql: `start`,
      type: `string`
    },
    
    end: {
      sql: `end`,
      type: `string`
    },
    
    group: {
      sql: `group`,
      type: `string`
    },
    
    classname: {
      sql: `${CUBE}.\`className\``,
      type: `string`
    },
    
    content: {
      sql: `content`,
      type: `string`
    },
    
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    }
  }
});
