import { createServer, Model, Factory } from 'miragejs';

const teams = ['Engineering', 'Design', 'Product', 'Marketing', 'Leadership'];

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      employee: Model,
    },

    factories: {
      employee: Factory.extend({
        name() {
          const names = [
            'person1', 'person2', 'someone', 'anyone', 'no one',
            'thing1', 'thing2', 'objectX', 'entityY', 'anon'
          ];
          return names[Math.floor(Math.random() * names.length)];
        },

        designation() {
          const simpleRoles = {
            Engineering: ['engineer'],
            Design: ['designer'],
            Product: ['manager'],
            Marketing: ['marketer'],
            Leadership: ['CEO', 'CTO']
          };
          const team = teams[Math.floor(Math.random() * teams.length)];
          const teamDesignations = simpleRoles[team as keyof typeof simpleRoles];
          return teamDesignations[Math.floor(Math.random() * teamDesignations.length)];
        },

        team() {
          return teams[Math.floor(Math.random() * teams.length)];
        },

        avatar() {
          return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
        }
      }),
    },

    seeds(server) {
      // CEO
      const ceo = server.create('employee', {
        id: '1',
        name: 'Shalin Jain',
        designation: 'CEO',
        team: 'Leadership',
        managerId: null,
      });

      // CTO
      const cto = server.create('employee', {
        id: '2',
        name: 'Pradeek J',
        designation: 'CTO',
        team: 'Leadership',
        managerId: ceo.id,
      });

      // Simplified team members
      const employees = [
        { id: '3', name: 'person1', designation: 'engineer', team: 'Engineering', managerId: cto.id },
        { id: '4', name: 'person2', designation: 'engineer', team: 'Engineering', managerId: cto.id },
        { id: '5', name: 'someone', designation: 'engineer', team: 'Engineering', managerId: cto.id },

        { id: '6', name: 'noone', designation: 'designer', team: 'Design', managerId: cto.id },
        { id: '7', name: 'thing1', designation: 'designer', team: 'Design', managerId: cto.id },

        { id: '8', name: 'thing2', designation: 'manager', team: 'Product', managerId: ceo.id },
        { id: '9', name: 'object', designation: 'manager', team: 'Product', managerId: '8' },

        { id: '10', name: 'person3', designation: 'marketer', team: 'Marketing', managerId: ceo.id },
        { id: '11', name: 'notwo', designation: 'marketer', team: 'Marketing', managerId: '10' },
      ];

      employees.forEach(emp => server.create('employee', emp));
    },

    routes() {
      this.namespace = 'api';

      this.get('/employees', (schema) => {
        return schema.all('employee');
      });

      this.put('/employees/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const employee = schema.find('employee', id);

        if (!employee) {
          // @ts-ignore
          return new this.Response(404, {}, { error: 'Employee not found' });
        }

        const employees = schema.all('employee').models;
        const isCircular = checkCircularReference(employees, id, attrs.managerId);

        if (isCircular) {
          // @ts-ignore
          return new this.Response(400, { error: 'Circular reference detected' });
        }

        const updated = employee.update(attrs);
        // @ts-ignore
        return updated ?? new this.Response(500, {}, { error: 'Failed to update employee' });
      });

      this.post('/employees', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('employee', attrs);
      });

      this.delete('/employees/:id', (schema, request) => {
        const id = request.params.id;
        const employee = schema.find('employee', id);
        if (employee) {
          employee.destroy();
          // @ts-ignore
          return new this.Response(204);
        } else {
          // @ts-ignore
          return new this.Response(404, {}, { error: 'Employee not found' });
        }
      });
    }
  });
}

function checkCircularReference(employees: any[], employeeId: string, newManagerId: string | null): boolean {
  if (!newManagerId || newManagerId === employeeId) return false;

  let currentManagerId = newManagerId;
  const visited = new Set<string>();

  while (currentManagerId && !visited.has(currentManagerId)) {
    if (currentManagerId === employeeId) return true;
    visited.add(currentManagerId);

    const manager = employees.find(emp => emp.id === currentManagerId);
    currentManagerId = manager?.managerId;
  }

  return false;
}
