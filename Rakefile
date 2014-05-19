require 'zip/zip'
require 'nokogiri'
require_relative 'catalog'
require_relative 'wirecloud'

BOOTSTRAP_URI = 'http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'
XSLT_XML_FILE = 'widget.xslt'
XSLT_RDF_FILE = 'widget-rdf.xslt'
DOC_FILE = 'documentation.htm'
BUNDLE_FILE = '.bundle'


desc 'Create zipped Wirecloud widget file for the specified project'
task :bundle, [:what, :suffix] do |_, args|
  args.with_defaults(:suffix => '')
  project = args[:what]
  archive = "#{project}#{args[:suffix]}.wgt"

  if project && Dir.exists?(project)
    File.delete(archive) if File.exists?(archive)
    puts "Bundling #{project} as #{archive}..."

    Zip::ZipFile.open(archive, Zip::ZipFile::CREATE) do |z|
      Dir[File.join(project, '**', '**')].each do |file|
        z.add(file.sub("#{project}/", ''), file) unless /[a-z]+\.md/i =~ file
      end
    end
  end
end

desc 'Updates the OOI WSR API library in all subdirectories'
task :update do
  src = File.absolute_path 'wsrapi.js'
  raise "Could not find #{src}" unless File.exists?(src)
  Dir.glob('**/js').each do |subdirectory|
    dst = File.absolute_path "#{subdirectory}/wsrapi.js"
    if File.exists?(dst)
      FileUtils::cp(src, dst)
      puts "Updating #{dst}"
    end
  end
end

desc "Create documentation (#{DOC_FILE} files)"
task :doc do
  all_human_readable_files = { }
  Dir.glob('**').each do |subdirectory|
    config_file = File.join(subdirectory, 'config.xml')
    if File.exists? config_file
      begin
        config = Nokogiri::XML(File.read(config_file))
        if config.root.namespace.href == 'http://wirecloud.conwet.fi.upm.es/ns/template#'
          stylesheet = Nokogiri::XSLT(File.read(XSLT_XML_FILE))
          human_readable = stylesheet.transform config
          human_readable_file = File.join(subdirectory, DOC_FILE)
          File.write(human_readable_file, human_readable)

          puts "Writing documentation for #{subdirectory} (XML) in #{human_readable_file}"

          all_human_readable_files[subdirectory] = human_readable_file
        elsif config.root.namespace.href == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
          stylesheet = Nokogiri::XSLT(File.read(XSLT_RDF_FILE))
          human_readable = stylesheet.transform config
          human_readable_file = File.join(subdirectory, DOC_FILE)
          File.write(human_readable_file, human_readable)

          puts "Writing documentation for #{subdirectory} (RDF) in #{human_readable_file}"

          all_human_readable_files[subdirectory] = human_readable_file
        else
          puts "Warning: I don't know how to handle the XML namespace #{config.root.namespace.href} yet! I'll skip #{config_file} for now."
        end
      rescue => e
        puts "Could not process #{config_file}; skipping. Reason: #{e.message}"
      end
    end
  end

  doc_index = Nokogiri::HTML::Builder.new do |doc|
    doc.html lang: 'en' do
      doc.head {
        doc.title 'Documentation index'
        doc.meta name: 'viewport', content: 'width=device-width, initial-scale=1.0'
        doc.link href: BOOTSTRAP_URI, rel: 'stylesheet'
        doc.style 'body { background-color: #eee } .container { background-color: #fff; border: 1px solid #ccc; margin-top: 1em; border-radius: 5px }', type: 'text/css'
      }
      doc.body {
        doc.div class: 'container' do
          doc.p 'Pick a widget/operator from the list below to see its automatically generated documentation:', class: 'text-info'
          doc.ul {
            all_human_readable_files.each { |k,v| doc.li { doc.a k, href: v } }
          }
        end
      }
    end
  end
  File.write(DOC_FILE, doc_index.to_html)
end

desc 'Remove generated files'
task :cleanup do
  Dir.glob('*.wgt').each do |bundledFile|
    puts "Removing old bundle: #{bundledFile}"
    File.delete bundledFile
  end
  Dir.glob("*/#{DOC_FILE}").each do |bundledFile|
    puts "Removing old documentation: #{bundledFile}"
    File.delete bundledFile
  end
  File.delete DOC_FILE if File.exists? DOC_FILE
end

desc 'Create all zipped Wirecloud widget files'
task :all => [:cleanup] do
  suffix = "-git-#{run_process 'git rev-parse --short HEAD'}-#{Time.now.strftime('%y%m%d-%H%M')}"

  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, BUNDLE_FILE))
      Rake::Task[:bundle].invoke subdirectory, suffix
      Rake::Task[:bundle].reenable
    end
  end
end

desc 'Deploy to Wirecloud'
task :deploy, [:username, :password, :instance] do |_, args|
  args.with_defaults(:instance => 'http://wirecloud.ait.ac.at')

  raise 'No username specified!' unless args[:username]
  raise 'No password specified!' unless args[:password]

  puts "Connecting to #{args[:instance]} as #{args[:username]}..."
  wirecloud = Wirecloud.new(args[:instance] =~ /^http/i ? args[:instance] : "http://#{args[:instance]}")
  wirecloud.login! args[:username], args[:password]

  remote_resources = wirecloud.resources
  remote_resources_to_drop = [ ]
  resources_to_up = [ ]

  Dir.glob('*.wgt').each do |bundledFile|
    Zip::ZipFile.open bundledFile, false do |zip|
      xml = Nokogiri::XML(zip.read('config.xml'))
      cfg = Wirecloud.inspect_config xml
      cfg[:file] = bundledFile
      key_str = "#{cfg[:vendor]}/#{cfg[:name]}/#{cfg[:version]}"
      remote_resources_to_drop.push(cfg) if remote_resources.has_key? key_str
      resources_to_up.push(cfg)
    end
  end

  begin
    if remote_resources_to_drop.any?
      puts 'WARNING!'
      puts 'The following components will be removed and re-uploaded:'
      remote_resources_to_drop.each { |r| puts "  * #{r[:vendor]}/#{r[:name]}/#{r[:version]}" }
      puts 'This cannot be undone and may cause side-effects.'
      puts 'Are you absolutely, positively certain you want to continue? [y/N]'
      choice = $stdin.getc
      exit if choice =~ /^[^y]$/i

      remote_resources_to_drop.each do |r|
        puts "Removing #{r[:name]}..."
        wirecloud.delete_resource! r[:vendor], r[:name], r[:version]
      end
    end

    resources_to_up.each do |r|
      puts "Uploading #{r[:name]} (#{r[:file]})..."
      wirecloud.upload_resource! r[:file]
    end
  rescue
    $stderr.puts 'Something went horribly, horribly wrong. This is nothing I can recover from.'
    $stderr.puts 'Please IMMEDIATELY verify the state of your wirecloud instance:'
    $stderr.puts "URL: #{args[:instance]}, account: #{args[:username]}"
    raise
  end
end

desc 'Update catalog'
task :catalog, [:username, :password] do |_, args|
  raise 'No username specified!' unless args[:username]
  raise 'No password specified!' unless args[:password]

  api = CRISMA::Catalog.new
  api.authenticate args[:username], args[:password]

  Dir.glob('*/.catalog').each do |bundledFile|
    catalog_id = File.read bundledFile
    config_file = File.join(File.dirname(bundledFile), 'config.xml')
    puts "* Updating node #{catalog_id} using #{config_file}"
    config_data = Nokogiri::XML(File.read(config_file)).remove_namespaces!

    # TODO: replace with Wirecloud's new Wirecloud.inspect_config method?
    cfg_title = config_data.xpath('//Catalog.ResourceDescription/DisplayName').text
    cfg_description = config_data.xpath('//Catalog.ResourceDescription/Description').text
    cfg_version = config_data.xpath('//Catalog.ResourceDescription/Version').text
    cfg_description_html = Nokogiri::HTML::DocumentFragment.parse ''
    Nokogiri::HTML::Builder.with cfg_description_html do |doc|
      doc.p cfg_description.strip
    end

    api.update_component catalog_id, "Wirecloud #{cfg_title}", cfg_description_html.to_html, cfg_version
    puts "* Node #{catalog_id} updated"
  end
end

def run_process(process)
  begin
    IO.popen(process, 'r') do |p|
      return p.gets.strip
    end
  rescue
    return nil
  end
end