<?php
// Template for rendering the Restpress settings inside wp-admin
?>

<div class="-ml-5">
	<div class="min-h-screen relative">
		<div class="bg-indigo-500 mb-8">
			<div class="max-w-4xl mx-auto px-4 py-12">
				<h1 class="text-2xl text-white text-left">
					Restpress
					<span class="text-sm block">The automated REST API docs generator</span>
				</h1>
			</div>
		</div>

		<div class="max-w-4xl mx-auto px-4">
			<?php
			if (isset($_GET['settings-updated'])) {
				add_settings_error(
				'restpress_plugin_messages',
				'restpress_plugin_message',
				'Settings saved!',
				'rounded border-s-4 border-green-500 bg-green-50 py-2 px-4 m-0 mb-4');
			}

			settings_errors('restpress_plugin_messages');
			?>

			<form
				method="post"
				action="options.php"
			>
				<?php
				// output security fields for the registered setting "restpress_plugin"
				settings_fields( 'restpress_plugin' );
				do_settings_sections( 'restpress_plugin' );
				?>

				<div class="flex items-center justify-end gap-2 py-3 px-2">
					<input
						type="submit"
						value="Save changes"
						class="rounded bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
					/>
				</div>
			</form>
		</div>
	</div>
</div>
