<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('public homepage renders with inertia and required props', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/HomePage')
        ->has('featuredProducts')
        ->has('categories')
        ->has('company')
    );
});

test('public products catalog renders with inertia', function () {
    $category = Category::create([
        'name' => 'Cardio Test',
        'slug' => 'cardio-test',
        'status' => 'active',
    ]);

    Product::create([
        'category_id' => $category->id,
        'brand_name' => 'CardioZen',
        'slug' => 'cardiozen',
        'status' => 'active',
    ]);

    $response = $this->get('/products');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/ProductsPage')
        ->has('products')
        ->has('categories')
    );
});

test('login page renders for guests', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/LoginPage')
    );
});

test('admin can authenticate via web session and logout', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@pharma.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post('/login', [
        'email' => 'admin@pharma.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/admin');
    $this->assertAuthenticatedAs($admin);

    $logoutResponse = $this->post('/logout');
    $logoutResponse->assertRedirect('/login');
    $this->assertGuest();
});

test('unauthenticated user cannot access admin backoffice', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});

test('authenticated admin can access admin dashboard, categories and products', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Dashboard')
            ->has('stats')
        );

    $this->actingAs($admin)
        ->get('/admin/categories')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/category/CategoryList')
            ->has('categories')
        );

    $this->actingAs($admin)
        ->get('/admin/products')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/product/ProductList')
            ->has('products')
        );

    $this->actingAs($admin)
        ->get('/admin/settings')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/Settings')
            ->has('settings')
        );
});

test('admin can create, update, toggle status and delete category via web routes', function () {
    $admin = User::factory()->admin()->create();

    // Create
    $createResponse = $this->actingAs($admin)->post('/admin/categories', [
        'name' => 'Dermatology Care',
        'description' => 'Skin treatments',
        'status' => 'active',
    ]);
    $createResponse->assertRedirect('/admin/categories');
    $this->assertDatabaseHas('categories', ['name' => 'Dermatology Care']);

    $category = Category::where('name', 'Dermatology Care')->first();

    // Update
    $updateResponse = $this->actingAs($admin)->put("/admin/categories/{$category->id}", [
        'name' => 'Advanced Dermatology Care',
        'description' => 'Updated skin treatments',
        'status' => 'active',
    ]);
    $updateResponse->assertRedirect('/admin/categories');
    $this->assertDatabaseHas('categories', ['name' => 'Advanced Dermatology Care']);

    // Toggle Status
    $statusResponse = $this->actingAs($admin)->patch("/admin/categories/{$category->id}/status", [
        'status' => 'inactive',
    ]);
    $statusResponse->assertRedirect();
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'status' => 'inactive']);

    // Delete
    $deleteResponse = $this->actingAs($admin)->delete("/admin/categories/{$category->id}");
    $deleteResponse->assertRedirect('/admin/categories');
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('admin can create, update, toggle status and delete product via web routes', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::create([
        'name' => 'Respiratory Care',
        'slug' => 'respiratory-care',
        'status' => 'active',
    ]);

    // Create
    $createResponse = $this->actingAs($admin)->post('/admin/products', [
        'category_id' => $category->id,
        'brand_name' => 'AsthmaClear',
        'generic_name' => 'Salbutamol',
        'dosage_form' => 'Inhaler',
        'strength' => '100mcg',
        'status' => 'active',
        'is_featured' => true,
    ]);
    $createResponse->assertRedirect('/admin/products');
    $this->assertDatabaseHas('products', ['brand_name' => 'AsthmaClear']);

    $product = Product::where('brand_name', 'AsthmaClear')->first();

    // Update
    $updateResponse = $this->actingAs($admin)->put("/admin/products/{$product->id}", [
        'category_id' => $category->id,
        'brand_name' => 'AsthmaClear Forte',
        'generic_name' => 'Salbutamol',
        'dosage_form' => 'Inhaler',
        'strength' => '200mcg',
        'status' => 'active',
    ]);
    $updateResponse->assertRedirect('/admin/products');
    $this->assertDatabaseHas('products', ['brand_name' => 'AsthmaClear Forte']);

    // Toggle Status
    $statusResponse = $this->actingAs($admin)->patch("/admin/products/{$product->id}/status", [
        'status' => 'inactive',
    ]);
    $statusResponse->assertRedirect();
    $this->assertDatabaseHas('products', ['id' => $product->id, 'status' => 'inactive']);

    // Delete
    $deleteResponse = $this->actingAs($admin)->delete("/admin/products/{$product->id}");
    $deleteResponse->assertRedirect('/admin/products');
    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});

test('enquiry submission processes and redirects with flash message', function () {
    $payload = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'organization' => 'Health Corp',
        'country' => 'India',
        'message' => 'Requesting supply inquiry.',
    ];

    $response = $this->post('/enquiry', $payload);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});

test('admin can manage staff members and assign roles', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $admin = User::factory()->admin()->create();

    // Access staff list
    $this->actingAs($admin)
        ->get('/admin/staff')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/staff/StaffList')
            ->has('staff')
            ->has('roles')
        );

    // Create a new Medical Representative staff member
    $createResponse = $this->actingAs($admin)->post('/admin/staff', [
        'name' => 'Dr. Rakesh Verma',
        'email' => 'rakesh.mr@ciplon.com',
        'role' => 'mr',
        'password' => 'secretPass123',
    ]);
    $createResponse->assertRedirect('/admin/staff');

    $this->assertDatabaseHas('users', ['email' => 'rakesh.mr@ciplon.com']);
    $mrUser = User::where('email', 'rakesh.mr@ciplon.com')->first();
    expect($mrUser->hasRole('mr'))->toBeTrue();

    // Update staff role to Manager
    $updateResponse = $this->actingAs($admin)->put("/admin/staff/{$mrUser->id}", [
        'name' => 'Dr. Rakesh Verma (Promoted)',
        'email' => 'rakesh.mr@ciplon.com',
        'role' => 'manager',
    ]);
    $updateResponse->assertRedirect('/admin/staff');

    $mrUser->refresh();
    expect($mrUser->hasRole('manager'))->toBeTrue();
    expect($mrUser->name)->toBe('Dr. Rakesh Verma (Promoted)');

    // Delete staff member
    $deleteResponse = $this->actingAs($admin)->delete("/admin/staff/{$mrUser->id}");
    $deleteResponse->assertRedirect('/admin/staff');
    $this->assertDatabaseMissing('users', ['id' => $mrUser->id]);
});

test('admin can view roles list and create custom role with permissions', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $admin = User::factory()->admin()->create();

    // Access roles list
    $this->actingAs($admin)
        ->get('/admin/roles')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/roles/RoleList')
            ->has('roles')
        );

    // Create a new role
    $createResponse = $this->actingAs($admin)->post('/admin/roles', [
        'name' => 'field_supervisor',
        'permissions' => ['products.view', 'dcr.view', 'doctors.view'],
    ]);
    $createResponse->assertRedirect('/admin/roles');

    $this->assertDatabaseHas('roles', ['name' => 'field_supervisor']);
    $role = Role::findByName('field_supervisor');
    expect($role->hasPermissionTo('dcr.view'))->toBeTrue();
});
test('super_admin can authenticate via web session and access admin backoffice', function () {
    $superAdmin = User::factory()->create([
        'email' => 'super@pharma.com',
        'role' => 'super_admin',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post('/login', [
        'email' => 'super@pharma.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/admin');
    $this->assertAuthenticatedAs($superAdmin);

    $dashboardResponse = $this->get('/admin');
    $dashboardResponse->assertStatus(200);
});
