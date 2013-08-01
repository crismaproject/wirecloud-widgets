require 'zip/zip'

desc 'Create zipped Wirecloud widget file for the specified project'
task :bundle, [:what] do |t, args|
  project = args[:what]
  archive = "#{project}.wgt"

  if project && Dir.exists?(project)
    File.delete(archive) if File.exists?(archive)
    puts "Bundling #{project} as #{archive}..."

    Zip::ZipFile.open(archive, Zip::ZipFile::CREATE) do |z|
      Dir[File.join(project, '**', '**')].each do |file|
        z.add(file.sub("#{project}/", ''), file) unless /README\.md/i =~ file
      end
    end
  end
end

desc 'Create all zipped Wirecloud widget files'
task :all do
  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, '.bundle'))
      Rake::Task[:bundle].invoke(subdirectory)
      Rake::Task[:bundle].reenable
    end
  end
end